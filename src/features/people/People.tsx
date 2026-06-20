import PeopleHeader from "./components/PeopleHeader";
import PeopleTabs from "./components/PeopleTabs";

export default function People() {
  return (
    <div className="space-y-6" dir="rtl">
      <PeopleHeader />
      <PeopleTabs />
    </div>
  );
}
