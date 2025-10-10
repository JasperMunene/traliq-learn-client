import React from 'react';
import CourseDetailClient from '@/components/Courses/CourseDetailClient';

interface CourseDetailPageProps {
  params: {
    id: string;
  };
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  return <CourseDetailClient courseId={params.id} />;
}
