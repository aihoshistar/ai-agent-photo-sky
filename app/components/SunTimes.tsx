interface SunTimes {
  sunrise?: string;
  sunset?: string;
}

interface Props {
  sunTimes: SunTimes;
}

export default function SunTimes({ sunTimes }: Props) {
  return (
    <div className="mb-4">
      <h2>Sun Times</h2>
      <p>일출: {sunTimes.sunrise}</p>
      <p>일몰: {sunTimes.sunset}</p>
    </div>
  );
}