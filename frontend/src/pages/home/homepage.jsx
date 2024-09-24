import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-2xl">Mi Sitio Web</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/about">Acerca de</Link></li>
            <li><Link to="/services">Servicios</Link></li>
            <li><Link to="/contact">Contacto</Link></li>
          </ul>
        </nav>
      </header>
      
      <section className="hero bg-blue-500 text-white p-20 text-center">
        <h2 className="text-4xl">Bienvenido a Mi Sitio Web</h2>
        <p className="mt-4">Ofrecemos los mejores servicios para ti.</p>
        <Link to="/signup" className="mt-6 inline-block bg-white text-blue-500 p-2 rounded">Empieza Ahora</Link>
      </section>
      
      <section className="about p-10">
        <h3 className="text-2xl">Sobre Nosotros</h3>
        <p>Aquí hay una breve descripción de lo que hacemos.</p>
      </section>

      <section className="services p-10 bg-gray-100">
        <h3 className="text-2xl">Nuestros Servicios</h3>
        <ul>
          <li>Servicio 1</li>
          <li>Servicio 2</li>
          <li>Servicio 3</li>
        </ul>
      </section>

      <section className="testimonials p-10">
        <h3 className="text-2xl">Testimonios</h3>
        <blockquote>"Excelente servicio!" - Cliente Satisfecho</blockquote>
      </section>

      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>© 2024 Mi Sitio Web. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default HomePage;
