import { useQuery } from "@tanstack/react-query";
import CourseCard from "@/components/ui/course-card";

export default function Courses() {
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['/api/courses'],
  });

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase font-montserrat">Catálogo</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl font-montserrat">
            Explora Nuestros Cursos
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Descubre nuestra selección de cursos especializados con certificaciones verificables en la blockchain.
          </p>
        </div>

        <div className="mt-10">
          {isLoading ? (
            <div className="text-center py-10">
              <span className="material-icons animate-spin text-primary-600 text-4xl">sync</span>
              <p className="mt-2 text-gray-600">Cargando cursos...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600">No hay cursos disponibles en este momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
