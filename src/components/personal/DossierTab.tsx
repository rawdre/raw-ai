import type { HealthData, Level } from "@/lib/personal/types";

const LEVEL_LABEL: Record<Level, string> = { ok: "OK", warn: "Atenção", bad: "Fora" };

// Home blood-pressure chart geometry (SVG user units).
const CHART = { width: 640, height: 200, left: 34, right: 12, top: 14, bottom: 26, min: 60, max: 150 };

export function DossierTab({ data }: { data: HealthData }) {
  return (
    <div className="pz-stack pz-dossier">
      <section>
        <h2 className="pz-poster pz-h2">Resumo para o médico — prioridades</h2>
        <ul className="pz-prios">
          {data.priorities.map((p) => (
            <li key={p.title} className={p.level}>
              <strong>{p.title}</strong>
              <span>{p.text}</span>
            </li>
          ))}
        </ul>
        <p className="pz-good">
          <strong>Dados favoráveis e limites.</strong> {data.favorable}
        </p>
      </section>

      <section>
        <h2 className="pz-poster pz-h2">Exames — julho × novembro</h2>
        {data.labs.map((group, i) => (
          <details key={group.title} className="pz-details" open={i === 1}>
            <summary>
              {group.title}
              <small>
                {group.rows.filter((r) => r[4] === "bad").length} fora · {group.rows.length} exames
              </small>
            </summary>
            <div className="pz-table-wrap">
              <table className="pz-table">
                <thead>
                  <tr>
                    <th>Exame</th>
                    <th>Julho</th>
                    <th>Novembro</th>
                    <th>Leitura</th>
                  </tr>
                </thead>
                <tbody>
                  {group.rows.map(([name, july, november, note, level]) => (
                    <tr key={name} className={level}>
                      <td>{name}</td>
                      <td>{july}</td>
                      <td>
                        <b>{november}</b>
                      </td>
                      <td>
                        <span className={`pz-flag ${level}`}>{LEVEL_LABEL[level]}</span> {note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="pz-fine">{group.note}</p>
          </details>
        ))}
      </section>

      <section>
        <h2 className="pz-poster pz-h2">Pressão em casa</h2>
        <p>{data.homeBp.summary}</p>
        <BpChart readings={data.homeBp.readings} />
        <p className="pz-fine">{data.homeBp.history}</p>
        <p>{data.homeBp.reading}</p>
      </section>

      <section>
        <h2 className="pz-poster pz-h2">Cardiologia</h2>
        {data.cardio.map((c) => (
          <details key={c.title} className="pz-details">
            <summary>{c.title}</summary>
            <p>{c.text}</p>
          </details>
        ))}
      </section>

      <section>
        <h2 className="pz-poster pz-h2">Composição corporal · {data.body.date}</h2>
        <KeyValueTable rows={data.body.rows} />
        <p className="pz-fine">{data.body.note}</p>
      </section>

      <section>
        <h2 className="pz-poster pz-h2">Medicamentos</h2>
        <p className="pz-fine">{data.meds.note}</p>
        <div className="pz-table-wrap">
          <table className="pz-table">
            <thead>
              <tr>
                <th>Medicamento</th>
                <th>Apresentação</th>
                <th>Registro</th>
              </tr>
            </thead>
            <tbody>
              {data.meds.rows.map(([name, dose, note]) => (
                <tr key={name}>
                  <td>{name}</td>
                  <td>
                    <b>{dose}</b>
                  </td>
                  <td>{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          <strong>{data.meds.extra.title}.</strong> {data.meds.extra.text}
        </p>
        <ul className="pz-list">
          {data.meds.pending.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="pz-callout">{data.meds.review}</p>
      </section>

      <section>
        <h2 className="pz-poster pz-h2">Suplementos</h2>
        <p className="pz-fine">{data.supplements.note}</p>
        <KeyValueTable rows={data.supplements.rows} />
        <ul className="pz-list">
          {data.supplements.points.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="pz-poster pz-h2">Plano e consultas</h2>
        <p>{data.plan.who}</p>
        <KeyValueTable rows={data.plan.appointments} />
        <p className="pz-fine">{data.plan.apptNote}</p>
      </section>

      <section>
        <h2 className="pz-poster pz-h2">Linha do tempo</h2>
        <KeyValueTable rows={data.timeline} />
      </section>
    </div>
  );
}

function KeyValueTable({ rows }: { rows: [string, string][] }) {
  return (
    <div className="pz-table-wrap">
      <table className="pz-table pz-kv">
        <tbody>
          {rows.map(([key, value]) => (
            <tr key={key}>
              <th scope="row">{key}</th>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BpChart({ readings }: { readings: HealthData["homeBp"]["readings"] }) {
  const { width, height, left, right, top, bottom, min, max } = CHART;
  const plotW = width - left - right;
  const plotH = height - top - bottom;
  const x = (i: number) => left + (readings.length === 1 ? plotW / 2 : (i / (readings.length - 1)) * plotW);
  const y = (v: number) => top + ((max - v) / (max - min)) * plotH;
  const line = (index: 1 | 2) => readings.map((r, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(r[index]).toFixed(1)}`).join(" ");
  const ticks = [60, 80, 100, 120, 140];
  const anchor = (i: number) => (i === 0 ? "start" : i === readings.length - 1 ? "end" : "middle");

  return (
    <div className="pz-table-wrap">
      <svg viewBox={`0 0 ${width} ${height}`} className="pz-chart" role="img" aria-label="Leituras de pressão em casa: sistólica e diastólica">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={left} x2={width - right} y1={y(t)} y2={y(t)} className="grid" />
            <text x={left - 6} y={y(t) + 3} textAnchor="end">
              {t}
            </text>
          </g>
        ))}
        <path d={line(1)} className="sys" />
        <path d={line(2)} className="dia" />
        {readings.map(([when, sys, dia], i) => (
          <g key={when}>
            <circle cx={x(i)} cy={y(sys)} r={4} className="sys-dot">
              <title>{`${when}: ${sys}/${dia}`}</title>
            </circle>
            <circle cx={x(i)} cy={y(dia)} r={4} className="dia-dot" />
            <text x={x(i)} y={y(sys) - 8} textAnchor={anchor(i)} className="val">
              {sys}/{dia}
            </text>
            <text x={x(i)} y={height - 8} textAnchor={anchor(i)}>
              {when.split(" ")[0]}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
