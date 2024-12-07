"use client";

import React, { Suspense } from "react";
import TeacherResultUpload from "./TeacherResultUpload";

export default function AddResultsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TeacherResultUpload />
    </Suspense>
  );
}
