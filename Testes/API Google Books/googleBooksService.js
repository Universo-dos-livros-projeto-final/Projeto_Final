// services/googleBooksService.js
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class GoogleBooksService {
  constructor() {
    this.apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    this.baseUrl = 'https://www.googleapis.com/books/v1/volumes';
  }

  /**
   * Busca livros na API do Google Books
   */
  async searchBooks(query, maxResults = 10) {
    try {
      const response = await axios.get(`${this.baseUrl}?q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${this.apiKey}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar livros:', error.message);
      throw new Error('Falha ao buscar livros na API do Google Books');
    }
  }

  /**
   * Busca um livro específico pelo ID do Google Books
   */
  async getBookById(googleBookId) {
    try {
      const response = await axios.get(`${this.baseUrl}/${googleBookId}?key=${this.apiKey}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar livro ${googleBookId}:`, error.message);
      throw new Error('Falha ao buscar livro específico na API do Google Books');
    }
  }

  /**
   * Extrai ISBN de um livro
   */
  extractIsbn(identifiers) {
    if (!identifiers) return null;
    
    for (const identifier of identifiers) {
      if (identifier.type === 'ISBN_13') {
        return identifier.identifier;
      } else if (identifier.type === 'ISBN_10') {
        return identifier.identifier;
      }
    }
    return null;
  }

  /**
   * Adiciona um livro ao banco de dados a partir dos dados da API
   */
  async addBookToDatabase(googleBookData, quantity = 0, price = 0) {
    try {
      const volumeInfo = googleBookData.volumeInfo;
      const googleBookId = googleBookData.id;

      // Verificar se o livro já existe
      const existingBook = await prisma.book.findUnique({
        where: { googleBookId }
      });

      let bookId;

      if (existingBook) {
        // Atualizar livro existente
        const updatedBook = await prisma.book.update({
          where: { id: existingBook.id },
          data: {
            title: volumeInfo.title,
            author: volumeInfo.authors ? volumeInfo.authors.join(', ') : null,
            publisher: volumeInfo.publisher || null,
            publishedDate: volumeInfo.publishedDate ? new Date(volumeInfo.publishedDate) : null,
            description: volumeInfo.description || null,
            pageCount: volumeInfo.pageCount || null,
            thumbnailUrl: volumeInfo.imageLinks?.thumbnail || null,
            infoLink: volumeInfo.infoLink || null,
          }
        });
        bookId = updatedBook.id;
      } else {
        // Criar novo livro
        const newBook = await prisma.book.create({
          data: {
            googleBookId,
            isbn: this.extractIsbn(volumeInfo.industryIdentifiers),
            title: volumeInfo.title,
            author: volumeInfo.authors ? volumeInfo.authors.join(', ') : null,
            publisher: volumeInfo.publisher || null,
            publishedDate: volumeInfo.publishedDate ? new Date(volumeInfo.publishedDate) : null,
            description: volumeInfo.description || null,
            pageCount: volumeInfo.pageCount || null,
            thumbnailUrl: volumeInfo.imageLinks?.thumbnail || null,
            infoLink: volumeInfo.infoLink || null,
          }
        });
        bookId = newBook.id;
      }

      // Atualizar ou criar inventário
      await this.updateInventory(bookId, quantity, price);

      return bookId;
    } catch (error) {
      console.error('Erro ao adicionar livro ao banco:', error);
      throw new Error(`Falha ao adicionar livro ao banco de dados: ${error.message}`);
    }
  }

  /**
   * Atualiza ou cria o inventário de um livro
   */
  async updateInventory(bookId, quantity, price) {
    try {
      const status = this.determineStockStatus(quantity);

      // Verificar se o inventário já existe
      const existingInventory = await prisma.inventory.findUnique({
        where: { bookId }
      });

      if (existingInventory) {
        // Atualizar inventário existente
        return await prisma.inventory.update({
          where: { bookId },
          data: {
            quantity,
            price,
            status,
            lastRestockDate: new Date()
          }
        });
      } else {
        // Criar novo inventário
        return await prisma.inventory.create({
          data: {
            bookId,
            quantity,
            price,
            status,
            lastRestockDate: new Date()
          }
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar inventário:', error);
      throw new Error(`Falha ao atualizar inventário: ${error.message}`);
    }
  }

  /**
   * Determina o status do estoque com base na quantidade
   */
  determineStockStatus(quantity) {
    if (quantity <= 0) {
      return 'OUT_OF_STOCK';
    } else if (quantity < 5) {
      return 'LOW_STOCK';
    } else {
      return 'AVAILABLE';
    }
  }

  /**
   * Atualiza o estoque após uma venda
   */
  async updateStockAfterSale(bookId, quantitySold) {
    try {
      // Obter o inventário atual
      const inventory = await prisma.inventory.findUnique({
        where: { bookId },
        select: { quantity: true, price: true }
      });

      if (!inventory) {
        throw new Error('Inventário não encontrado para este livro');
      }

      const newQuantity = inventory.quantity - quantitySold;
      const status = this.determineStockStatus(newQuantity);

      // Atualizar o inventário com transação
      return await prisma.$transaction([
        // Atualizar o estoque
        prisma.inventory.update({
          where: { bookId },
          data: {
            quantity: newQuantity,
            status
          }
        }),
        
        // Registrar a venda
        prisma.salesHistory.create({
          data: {
            bookId,
            quantity: quantitySold,
            salePrice: inventory.price
          }
        })
      ]);
    } catch (error) {
      console.error('Erro ao atualizar estoque após venda:', error);
      throw new Error(`Falha ao atualizar estoque após venda: ${error.message}`);
    }
  }

  /**
   * Busca produtos com estoque baixo
   */
  async getLowStockProducts() {
    try {
      return await prisma.book.findMany({
        where: {
          inventory: {
            status: 'LOW_STOCK'
          }
        },
        include: {
          inventory: true
        }
      });
    } catch (error) {
      console.error('Erro ao buscar produtos com estoque baixo:', error);
      throw new Error('Falha ao buscar produtos com estoque baixo');
    }
  }

  /**
   * Importa vários livros de uma vez
   */
  async importBooksFromSearch(query, maxResults = 10, defaultQuantity = 0, defaultPrice = 0) {
    try {
      const booksData = await this.searchBooks(query, maxResults);
      const importedBooks = [];

      if (booksData.items && Array.isArray(booksData.items)) {
        for (const bookData of booksData.items) {
          try {
            const bookId = await this.addBookToDatabase(bookData, defaultQuantity, defaultPrice);
            importedBooks.push(bookId);
          } catch (error) {
            console.error(`Erro ao importar livro: ${error.message}`);
          }
        }
      }

      return importedBooks;
    } catch (error) {
      console.error('Erro ao importar livros:', error);
      throw new Error(`Falha ao importar livros: ${error.message}`);
    }
  }
}

module.exports = GoogleBooksService;