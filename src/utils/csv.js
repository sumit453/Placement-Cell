import { format } from "@fast-csv/format";

// Returns a CSV formatter stream with headers and proper quoting
export function createCsvStream(header) {
  return format({
    headers: header,
    quoteColumns: true,
    quoteHeaders: true,
    writeBOM: true, // helps Excel open UTF-8 correctly
  });
}
