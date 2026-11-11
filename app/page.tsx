import { site } from "@/lib/site";

export default function Home() {
  return (
    <section>
      <h1 className="text-3xl font-semibold tracking-tight">{site.name}</h1>
      <p className="mt-3">{site.description}</p>
    </section>
  );
}
