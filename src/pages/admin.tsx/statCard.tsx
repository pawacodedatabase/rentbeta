import { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: Props) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow">

      <div className="flex justify-between">

        <div>

          <p className="text-gray-500">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>

        </div>

        <div
          className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center`}
        >
          <Icon
            size={26}
            className="text-white"
          />
        </div>

      </div>

    </div>
  );
}