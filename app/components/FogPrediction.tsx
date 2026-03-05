interface Props {
  fogPrediction: string;
}

export default function FogPrediction({ fogPrediction }: Props) {
  return (
    <div className="mb-4">
      <h2>Fog Prediction Index</h2>
      <p>{fogPrediction}</p>
    </div>
  );
}