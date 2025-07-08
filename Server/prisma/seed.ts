import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const userId = "15f4a6e2-0056-4a77-84ed-4083c34ac13f";

  // Criar um fornecedor (supplier)
  let supplier = await prisma.supplier.findFirst({
  where: { name: "Livraria Central" },
});

if (!supplier) {
  supplier = await prisma.supplier.create({
    data: {
      name: "Livraria Central",
      address: "Rua dos Livros, 123",
      phone: "912345678",
    },
  });
}

  // Criar 5 livros
  await prisma.book.createMany({
    data: [
      {
        title: "1984",
        description: "Um clássico distópico sobre vigilância e totalitarismo.",
        author: "George Orwell",
        publicationYear: 1949,
        genre: "Distopia",
        isbn: "9780451524935",
        price: 50,
        supplierId: supplier.id,
        userId: userId,
      },
      {
        title: "O Senhor dos Anéis",
        description: "A jornada épica de Frodo para destruir o Um Anel.",
        author: "J.R.R. Tolkien",
        publicationYear: 1954,
        genre: "Fantasia",
        isbn: "9780618640157",
        price: 85,
        supplierId: supplier.id,
        userId: userId,
      },
      {
        title: "Dom Casmurro",
        description: "A história de Bentinho e Capitu e suas dúvidas eternas.",
        author: "Machado de Assis",
        publicationYear: 1899,
        genre: "Romance",
        isbn: "9788572329654",
        price: 30,
        supplierId: supplier.id,
        userId: userId,
      },
      {
        title: "O Pequeno Príncipe",
        description: "Uma fábula poética sobre amor e responsabilidade.",
        author: "Antoine de Saint-Exupéry",
        publicationYear: 1943,
        genre: "Fábula",
        isbn: "9788595080802",
        price: 42,
        supplierId: supplier.id,
        userId: userId,
      },
      {
        title: "A Menina que Roubava Livros",
        description: "A história emocionante de uma jovem na Alemanha nazista.",
        author: "Markus Zusak",
        publicationYear: 2005,
        genre: "Drama",
        isbn: "9788535920420",
        price: 55,
        supplierId: supplier.id,
        userId: userId,
      },
    ],
  });

  console.log("✅ Seed com 5 livros finalizado com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro ao rodar o seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  