import DateQuest from "./date-quest-client";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function cleanName(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  const trimmed = (raw ?? "").trim();
  return trimmed.length ? trimmed.slice(0, 40) : "";
}

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  return <DateQuest initialName={cleanName(params.name)} />;
}
