import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-md bg-primary-600 flex items-center justify-center text-white font-bold text-lg">
                EB
              </div>
              <span className="ml-2 text-xl font-montserrat font-semibold text-white">EduBase</span>
            </div>
            <p className="mt-4 text-sm text-gray-300">
              Plataforma educativa descentralizada con certificaciones verificables en la blockchain de Base.
            </p>
            <div className="flex space-x-6 mt-6">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <span className="material-icons">twitter</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">GitHub</span>
                <span className="material-icons">code</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Discord</span>
                <span className="material-icons">forum</span>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Plataforma</h3>
            <ul className="mt-4 space-y-4">
              <li><Link href="/cursos" className="text-base text-gray-300 hover:text-white">Cursos</Link></li>
              <li><Link href="/certificaciones" className="text-base text-gray-300 hover:text-white">Attestations</Link></li>
              <li><Link href="/enviar-trabajo" className="text-base text-gray-300 hover:text-white">Agente de IA</Link></li>
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Para educadores</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Soporte</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Documentación</a></li>
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Guías</a></li>
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Preguntas frecuentes</a></li>
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Contacto</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Privacidad</a></li>
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Términos de uso</a></li>
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Verificación de attestations</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between">
          <p className="text-base text-gray-400">
            &copy; {new Date().getFullYear()} EduBase. Todos los derechos reservados.
          </p>
          <p className="text-base text-gray-400 mt-4 md:mt-0">
            Construido en Base Blockchain
          </p>
        </div>
      </div>
    </footer>
  );
}
