import ScoreByMatchChart from "@/components/Charts/ScoreByMatchChart";
import WinLostChart from "@/components/Charts/WinLostChart";
import MobileBackBar from "@/components/MobileBackBar";

const Statistics = () => {
  return (
    <div>
      <MobileBackBar title="Statisztikák" />
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold px-4">Nyereményed alakulása</h2>
        <ScoreByMatchChart />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold px-4">Találati arány</h2>
        <WinLostChart />
      </section>
    </div>
  );
};

export default Statistics;
