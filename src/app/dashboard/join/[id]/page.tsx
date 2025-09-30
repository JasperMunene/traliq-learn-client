"use client";
import dynamic from "next/dynamic";

const CourseLive = dynamic(() => import("@/components/CourseLive"), { ssr: false });

export default function JoinPage({ params }: { params: { id: string } }) {
    return <CourseLive courseId={params.id} />;
}