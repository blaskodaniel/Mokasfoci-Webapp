import ScoreByMatchChart from "@/components/Charts/ScoreByMatchChart";
import MobileBackBar from "@/components/MobileBackBar";

const Statistics = () => {
  return (
    <div>
      <MobileBackBar title="Statisztikák" />
      <ScoreByMatchChart />
    </div>
  );
};

export default Statistics;
