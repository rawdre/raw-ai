import { Ban, Check, X } from "lucide-react";
import type { HealthData } from "@/lib/personal/types";

export function FoodTab({ data }: { data: HealthData }) {
  const { food } = data.game;
  return (
    <div className="pz-stack">
      <section className="pz-food-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/personal/food.webp" alt="" />
        <div>
          <h2 className="pz-poster pz-h2">Abastecimento</h2>
          <p>{data.patientNote}</p>
        </div>
      </section>

      <div className="pz-food-cols">
        <section className="pz-panel pz-food go">
          <h3 className="pz-poster">Recarrega a vida</h3>
          <ul>
            {food.go.map((item) => (
              <li key={item}>
                <Check size={15} /> {item}
              </li>
            ))}
          </ul>
        </section>
        <section className="pz-panel pz-food stop">
          <h3 className="pz-poster">Sobe o nível de procurado</h3>
          <ul>
            {food.stop.map((item) => (
              <li key={item}>
                <X size={15} /> {item}
              </li>
            ))}
          </ul>
        </section>
        <section className="pz-panel pz-food never">
          <h3 className="pz-poster">Game over por conta própria</h3>
          <ul>
            {food.never.map((item) => (
              <li key={item}>
                <Ban size={15} /> {item}
              </li>
            ))}
          </ul>
        </section>
      </div>
      <p className="pz-fine">{food.note}</p>
    </div>
  );
}
