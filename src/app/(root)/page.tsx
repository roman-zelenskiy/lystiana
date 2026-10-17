import { Logo } from "@/components/ui/Logo";
import { detectScript } from "@/lib/i18n";

/** Скрипт переводить на /uk/ або /en/ до першої відмальовки; без JS лишаються посилання */
export default function LangRoot() {
  return (
    <main className="grid min-h-[100svh] place-content-center gap-8 px-4 text-center">
      <script dangerouslySetInnerHTML={{ __html: detectScript }} />
      <div className="mx-auto">
        <Logo />
      </div>
      <p className="flex flex-wrap justify-center gap-3">
        <a href="uk/" lang="uk" className="btn btn-forest h-14 px-7">Українською</a>
        <a href="en/" lang="en" className="btn btn-ghost h-14 px-7">English</a>
      </p>
    </main>
  );
}
