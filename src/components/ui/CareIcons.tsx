import type { Care } from "@/data/types";
import { difficultyLabel, lightLabel } from "@/data/catalog-meta";
import { Icon } from "./Icon";

const lightIcon = { shade: "shade", diffused: "diffused", bright: "sun" } as const;

/** Іконки догляду: світло, полив, складність, безпечність для тварин */
export function CareIcons({ care, compact = false }: { care: Care; compact?: boolean }) {
  const best = care.light[care.light.length - 1];
  return (
    <ul className={`flex flex-wrap items-center ${compact ? "gap-1.5" : "gap-2"}`} aria-label="Догляд">
      <li className="care-pill" title={`Світло: ${care.light.map((l) => lightLabel[l].toLowerCase()).join(", ")}`}>
        <Icon name={lightIcon[best]} size={16} className={best === "bright" ? "care-sun text-coral-deep" : "text-forest"} />
        <span className="sr-only">Світло: </span>
        <span className={compact ? "sr-only" : ""}>{care.light.map((l) => lightLabel[l]).join(" / ")}</span>
      </li>
      <li className="care-pill" title={`Полив: ${care.water}`}>
        <Icon name="drop" size={16} className="care-drop text-[#3f7fa8]" />
        <span className="sr-only">Полив: </span>
        <span className={compact ? "sr-only" : ""}>{care.water}</span>
      </li>
      <li className="care-pill" title={difficultyLabel[care.difficulty]}>
        {/* три листки складності — одним SVG */}
        <svg width="38" height="13" viewBox="0 0 66 22" aria-hidden="true">
          {[0, 1, 2].map((n) => (
            <path
              key={n}
              transform={`translate(${n * 22} 0)`}
              d="M3 19C3 10 9 4 19 3c0 9-6 16-14 16H3Z"
              fill={n < care.difficulty ? "var(--color-forest)" : "var(--color-line)"}
            />
          ))}
        </svg>
        <span className={compact ? "sr-only" : ""}>{difficultyLabel[care.difficulty]}</span>
      </li>
      {care.petSafe && (
        <li className="care-pill bg-butter/70" title="Безпечна для котів і собак">
          <Icon name="paw" size={16} className="care-paw text-ink" />
          <span className={compact ? "sr-only" : ""}>Безпечна для тварин</span>
        </li>
      )}
    </ul>
  );
}
