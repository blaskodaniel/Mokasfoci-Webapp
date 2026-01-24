import GroupStandings from "@/components/Widgets/GroupStandings";
import { useGetGroupsStandings } from "@/hooks/api/useTeams";

const GroupTables = () => {
  const standings = useGetGroupsStandings();
  return (
    <div>
      <div className="text-white text-center sm:text-left text-xl sm:text-2xl pb-2">
        Csoportállások
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 min-h-screen">
        {Object.entries(standings.data || {}).map(([groupName, teams]) => (
          <div key={groupName} className="mb-2 h-full flex flex-col">
            <GroupStandings groupName={groupName} teams={teams} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupTables;
