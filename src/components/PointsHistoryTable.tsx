import { useState } from "react";
import { PointEntry } from "@/types";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  entries: PointEntry[];
  pageSize?: number;
}

const PointsHistoryTable = ({ entries, pageSize = 5 }: Props) => {
  const [sortField, setSortField] = useState<"date" | "pointsAdded" | "pointsRemoved">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(0);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("desc"); }
  };

  const sorted = [...entries].sort((a, b) => {
    const mul = sortDir === "asc" ? 1 : -1;
    if (sortField === "date") return mul * (new Date(a.date).getTime() - new Date(b.date).getTime());
    return mul * ((a[sortField] as number) - (b[sortField] as number));
  });

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);

  if (entries.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground text-sm">No points history yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("date")}>
                <span className="flex items-center gap-1">Date <ArrowUpDown className="w-3 h-3" /></span>
              </TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Pointed By</TableHead>
              <TableHead className="cursor-pointer select-none text-right" onClick={() => toggleSort("pointsAdded")}>
                <span className="flex items-center justify-end gap-1">Added <ArrowUpDown className="w-3 h-3" /></span>
              </TableHead>
              <TableHead className="cursor-pointer select-none text-right" onClick={() => toggleSort("pointsRemoved")}>
                <span className="flex items-center justify-end gap-1">Removed <ArrowUpDown className="w-3 h-3" /></span>
              </TableHead>
              <TableHead className="text-right">Total Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="text-sm">{entry.date}</TableCell>
                <TableCell className="text-sm font-medium">{entry.reason}</TableCell>
                <TableCell className="text-sm">{"Admin"}</TableCell>
                <TableCell className="text-right text-sm">
                  {entry.pointsAdded > 0 ? (
                    <span className="text-success font-medium">+{entry.pointsAdded}</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right text-sm">
                  {entry.pointsRemoved > 0 ? (
                    <span className="text-destructive font-medium">-{entry.pointsRemoved}</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right text-sm font-medium">{entry.remainingPoints}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-muted-foreground">
            Page {page + 1} of {totalPages}
          </p>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PointsHistoryTable;
