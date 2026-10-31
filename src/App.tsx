
import { useState, useEffect } from "react";
import {
  BookOpen,
  Search,
  Code,
  Stethoscope,
  Languages,
  Calculator,
  BriefcaseBusiness,
} from "lucide-react";
import { supabase } from "./supabase";
import "./App.css";

const categories = [
  { name: "Computer Science", Icon: Code },
  { name: "Medical / MBBS", Icon: Stethoscope },
  { name: "English", Icon: Languages },
  { name: "Mathematics", Icon: Calculator },
  { name: "Business / BBA", Icon: BriefcaseBusiness },
];

type Book = {
  id: string;
  title: string;
  author: string | null;
  description: string | null;
  category: string | null;
  cover_url: string | null;
  file_url: string | null;
};

function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBooks() {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("ebooks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setBooks(data || []);
      }

      setLoading(false);
    }

    fetchBooks();
  }, []);

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      (book.category || "").toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || book.category === category;

    return matchesSearch && matchesCategory;
  });

  const colors = [
    "#2563eb",
    "#d97706",
    "#7c3aed",
    "#15803d",
    "#be185d",
  ];

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-left">
          <a href="#home">Home</a>
          <a href="#categories">Categories</a>
          <a href="#books">Books</a>
        </div>

        <a href="#home" className="logo">
          <BookOpen size={28} />
          <span>Pak<span className="blue">eLibrary</span></span>
        </a>

        <a href="#books" className="nav-button">
          Explore Books
        </a>
      </nav>

      <section className="hero" id="home">
        <span className="tag">YOUR DIGITAL LIBRARY</span>

        <h1>
          Knowledge for every
          <span className="blue"> Pakistani learner.</span>
        </h1>

        <p>
          Discover books, learn new skills, and explore educational
          resources for students, teachers, and everyone.
        </p>

        <div className="search-box">
          <Search size={22} />

          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setCategory("All");
            }}
            placeholder="Search books or subjects..."
          />

          <button
            onClick={() =>
              document.getElementById("books")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            Search
          </button>
        </div>
      </section>

      <section className="section" id="categories">
        <h2>Explore Categories</h2>
        <p className="subtitle">
          Find books according to your interests.
        </p>

        <div className="category-grid">
          {categories.map(({ name, Icon }) => (
            <button
              className={`category-card ${
                category === name ? "selected" : ""
              }`}
              key={name}
              onClick={() => {
                setCategory(name);
                document.getElementById("books")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              <Icon size={28} />
              <span>{name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="section" id="books">
        <h2>{category === "All" ? "Popular Books" : category}</h2>
        <p className="subtitle">
          Discover your next book to read.
        </p>

        <div className="filters">
          <button
            className={category === "All" ? "active" : ""}
            onClick={() => setCategory("All")}
          >
            All Books
          </button>

          {categories.map((item) => (
            <button
              key={item.name}
              className={category === item.name ? "active" : ""}
              onClick={() => setCategory(item.name)}
            >
              {item.name}
            </button>
          ))}
        </div>

        {loading && <p>Loading books from Supabase...</p>}

        {error && (
          <p style={{ color: "red" }}>
            Database Error: {error}
          </p>
        )}

        {!loading && !error && (
          <div className="book-grid">
            {filteredBooks.map((book, index) => (
              <article className="book-card" key={book.id}>
                <div
                  className="book-cover"
                  style={{
                    backgroundColor: colors[index % colors.length],
                    backgroundImage: book.cover_url
                      ? `url("${book.cover_url}")`
                      : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {!book.cover_url && (
                    <>
                      <BookOpen size={48} />
                      <strong>{book.title}</strong>
                      <small>PAK eLIBRARY</small>
                    </>
                  )}
                </div>

                <div className="book-info">
                  <span>{book.category || "General"}</span>
                  <h3>{book.title}</h3>
                  <p>
                    {book.author || book.description || "Educational learning resource"}
                  </p>

                  <button
                    className="read-button"
                    onClick={() => {
                      if (book.file_url) {
                        window.open(
                          book.file_url,
                          "_blank",
                          "noopener,noreferrer"
                        );
                      } else {
                        alert("PDF file has not been added yet.");
                      }
                    }}
                  >
                    Read Book →
                  </button>
                </div>
              </article>
            ))}

            {filteredBooks.length === 0 && (
              <p>No books found. Try another search.</p>
            )}
          </div>
        )}
      </section>

      <footer>
        <BookOpen size={22} />
        <strong>Pak eLibrary</strong>
        <p>Learning resources for everyone in Pakistan.</p>
        <small>© 2026 Pak eLibrary</small>
      </footer>
    </div>
  );
}

export default App;

