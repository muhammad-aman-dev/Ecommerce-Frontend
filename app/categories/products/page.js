import CategoryPage from "./CategoryWrapper.js";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <CategoryPage />
    </Suspense>
  );
}