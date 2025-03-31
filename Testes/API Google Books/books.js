// Obter um livro específico por ID
fastify.get('/api/books/:id', async (request, reply) => {
    const { id } = request.params;
    
    try {
      const book = await prisma.book.findUnique({
        where: { id },
        include: {
          inventory: true
        }
      });
      
      if (!book) {
        return reply.code(404).send({ error: 'Livro não encontrado' });
      }
      
      return reply.send(book);
    } catch (error) {
      return reply.code(500).send({ error: 'Erro ao buscar o livro do banco de dados' });
    }
  });
  
  // Atualizar um livro por ID
  fastify.put('/api/books/:id', async (request, reply) => {
    const { id } = request.params;
    const { title, authors, publisher, publishedDate, description, pageCount, price, quantity } = request.body;
    
    try {
      // Atualizar livro
      const updatedBook = await prisma.book.update({
        where: { id },
        data: {
          title,
          authors,
          publisher,
          publishedDate,
          description,
          pageCount,
          price: parseFloat(price || 0),
          inventory: {
            update: {
              quantity: parseInt(quantity || 0)
            }
          }
        },
        include: {
          inventory: true
        }
      });
      
      return reply.send(updatedBook);
    } catch (error) {
      if (error.code === 'P2025') {
        return reply.code(404).send({ error: 'Livro não encontrado' });
      }
      return reply.code(500).send({ error: 'Erro ao atualizar o livro' });
    }
  });
  
  // Deletar um livro por ID
  fastify.delete('/api/books/:id', async (request, reply) => {
    const { id } = request.params;
    
    try {
      // Primeiro deletar o inventário relacionado
      await prisma.inventory.deleteMany({
        where: { bookId: id }
      });
      
      // Depois deletar o livro
      await prisma.book.delete({
        where: { id }
      });
      
      return reply.send({ message: 'Livro removido com sucesso' });
    } catch (error) {
      if (error.code === 'P2025') {
        return reply.code(404).send({ error: 'Livro não encontrado' });
      }
      return reply.code(500).send({ error: 'Erro ao remover o livro' });
    }
  });