import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Course } from "@shared/schema";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="bg-white overflow-hidden shadow-md rounded-lg">
      <img 
        className="h-48 w-full object-cover" 
        src={course.imageUrl} 
        alt={course.title} 
      />
      <CardContent className="px-6 py-4">
        <div className="flex justify-between items-center mb-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            course.category === 'Blockchain' ? 'bg-secondary-100 text-secondary-800' : 
            course.category === 'Investigación' ? 'bg-green-100 text-green-800' : 
            'bg-purple-100 text-purple-800'
          }`}>
            {course.category}
          </span>
          <span className="text-xs text-gray-500">{course.duration}</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 font-montserrat mb-2">{course.title}</h3>
        <p className="text-gray-700 text-sm mb-4">
          {course.description}
        </p>
        <div className="flex justify-between items-center mt-4">
          <span className="flex items-center">
            {Array.from({ length: Math.floor(parseFloat(course.rating || '0')) }).map((_, i) => (
              <span key={i} className="material-icons text-yellow-500 text-sm">star</span>
            ))}
            {parseFloat(course.rating || '0') % 1 !== 0 && (
              <span className="material-icons text-yellow-500 text-sm">star_half</span>
            )}
            <span className="text-xs ml-1 text-gray-600">{course.rating}</span>
          </span>
          <span className="text-sm text-gray-600">{course.enrollments} inscritos</span>
        </div>
      </CardContent>
      <CardFooter className="px-6 pt-2 pb-4">
        <Link href={`/cursos/${course.id}`}>
          <Button className="w-full">
            Ver Detalles
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
