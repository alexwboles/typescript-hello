import "./style.css";

type Seat = 0 | 1;
type SeatingMatrix = Seat[][];

const TOTAL_ROWS = 8;
const TOTAL_COLUMNS = 10;

// Build a seating matrix initialized with available seats (0).
function createSeatingMatrix(rows = TOTAL_ROWS, columns = TOTAL_COLUMNS): SeatingMatrix {
  const matrix: SeatingMatrix = [];

  for (let row = 0; row < rows; row++) {
    const seatRow: Seat[] = [];

    for (let column = 0; column < columns; column++) {
      seatRow.push(0);
    }

    matrix.push(seatRow);
  }

  return matrix;
}

// Check whether a seat coordinate is inside valid bounds.
function isValidSeatPosition(matrix: SeatingMatrix, rowNumber: number, columnNumber: number): boolean {
  return (
    rowNumber >= 1 &&
    rowNumber <= matrix.length &&
    columnNumber >= 1 &&
    columnNumber <= matrix[0].length
  );
}

// Reserve one seat if available and return [success, status message].
function reserveSeat(
  matrix: SeatingMatrix,
  rowNumber: number,
  columnNumber: number,
  showMessage = true
): [boolean, string] {
  if (!isValidSeatPosition(matrix, rowNumber, columnNumber)) {
    const message = `Reservation failed: seat (${rowNumber}, ${columnNumber}) is out of range.`;
    if (showMessage) {
      console.log(message);
    }
    return [false, message];
  }

  const rowIndex = rowNumber - 1;
  const columnIndex = columnNumber - 1;

  if (matrix[rowIndex][columnIndex] === 1) {
    const message = `Reservation failed: seat (${rowNumber}, ${columnNumber}) is already occupied.`;
    if (showMessage) {
      console.log(message);
    }
    return [false, message];
  }

  matrix[rowIndex][columnIndex] = 1;
  const message = `Reservation confirmed: seat (${rowNumber}, ${columnNumber}) is now occupied.`;
  if (showMessage) {
    console.log(message);
  }
  return [true, message];
}

// Count occupied and available seats for summary reporting.
function countSeats(matrix: SeatingMatrix): [number, number] {
  let occupied = 0;

  for (let row = 0; row < matrix.length; row++) {
    for (let column = 0; column < matrix[row].length; column++) {
      if (matrix[row][column] === 1) {
        occupied++;
      }
    }
  }

  const totalSeats = matrix.length * matrix[0].length;
  const available = totalSeats - occupied;

  return [occupied, available];
}

// Find the first horizontal pair of adjacent available seats.
function findAdjacentAvailableSeats(
  matrix: SeatingMatrix
): [[number, number], [number, number]] | null {
  let row = 0;

  while (row < matrix.length) {
    let column = 0;

    while (column < matrix[row].length - 1) {
      if (matrix[row][column] === 0 && matrix[row][column + 1] === 0) {
        return [
          [row + 1, column + 1],
          [row + 1, column + 2],
        ];
      }

      column++;
    }

    row++;
  }

  return null;
}

// Mark a list of coordinates as occupied for scenario setup.
function occupySeats(matrix: SeatingMatrix, seats: [number, number][]): void {
  for (let i = 0; i < seats.length; i++) {
    const row = seats[i][0];
    const column = seats[i][1];

    if (isValidSeatPosition(matrix, row, column)) {
      matrix[row - 1][column - 1] = 1;
    }
  }
}

// Fill all seats in the matrix with one state (0 or 1).
function fillRoom(matrix: SeatingMatrix, state: Seat): void {
  for (let row = 0; row < matrix.length; row++) {
    for (let column = 0; column < matrix[row].length; column++) {
      matrix[row][column] = state;
    }
  }
}

// Print occupied and available totals in the console.
function printSeatCounters(matrix: SeatingMatrix): void {
  const [occupied, available] = countSeats(matrix);
  console.log(`Occupied seats: ${occupied}`);
  console.log(`Available seats: ${available}`);
}

// Build the clickable seat-grid markup for the interactive challenge section.
function seatMapGridHtml(matrix: SeatingMatrix, highlightedSeats: [number, number][]): string {
  let grid = '<div class="overflow-x-auto"><div class="inline-block min-w-max rounded-2xl border border-slate-200 bg-slate-50 p-4">';
  grid += '<div class="mb-2 grid" style="grid-template-columns: 56px repeat(10, minmax(0, 1fr)); gap: 8px;">';
  grid += '<div class="text-xs font-semibold uppercase tracking-wide text-slate-400">Seat</div>';

  for (let column = 1; column <= matrix[0].length; column++) {
    grid += `<div class="text-center text-xs font-semibold text-slate-500">${column}</div>`;
  }

  grid += "</div>";

  for (let row = 0; row < matrix.length; row++) {
    grid += '<div class="mb-2 grid" style="grid-template-columns: 56px repeat(10, minmax(0, 1fr)); gap: 8px;">';
    grid += `<div class="self-center text-sm font-bold text-slate-700">R${String(row + 1).padStart(2, "0")}</div>`;

    for (let column = 0; column < matrix[row].length; column++) {
      let isHighlighted = false;

      for (let i = 0; i < highlightedSeats.length; i++) {
        if (highlightedSeats[i][0] === row + 1 && highlightedSeats[i][1] === column + 1) {
          isHighlighted = true;
          break;
        }
      }

      const isOccupied = matrix[row][column] === 1;
      const seatClasses = isOccupied
        ? "bg-rose-600 text-white border-rose-700"
        : "bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200";
      const highlightClass = isHighlighted ? " ring-2 ring-amber-400 ring-offset-2" : "";

      grid += `
        <button
          type="button"
          class="seat-btn rounded-lg border px-2 py-2 text-xs font-bold transition ${seatClasses}${highlightClass}"
          data-row="${row + 1}"
          data-column="${column + 1}"
          aria-label="Seat row ${row + 1} column ${column + 1}"
        >
          ${isOccupied ? "X" : "L"}
        </button>
      `;
    }

    grid += "</div>";
  }

  grid += "</div></div>";

  return grid;
}

// Refresh interactive UI elements after each reservation attempt.
function renderInteractiveSeatManager(
  matrix: SeatingMatrix,
  latestMessage: string,
  highlightedSeats: [number, number][]
): void {
  const seatMap = document.querySelector<HTMLDivElement>("#interactive-seat-map");
  const status = document.querySelector<HTMLDivElement>("#interactive-status");

  if (!seatMap || !status) {
    return;
  }

  const [occupied, available] = countSeats(matrix);
  seatMap.innerHTML = seatMapGridHtml(matrix, highlightedSeats);
  status.textContent = `${latestMessage} Occupied: ${occupied}. Available: ${available}.`;
}

console.clear();
console.log("Cinema Seat Manager - TypeScript");

const interactiveRoom = createSeatingMatrix();
let interactiveMessage = "Click an available seat (L) to reserve it.";
let highlightedSeats: [number, number][] = [];

const app = document.querySelector<HTMLDivElement>("#app");
if (app) {
  app.innerHTML = `
    <section class="space-y-2">
      <h1 class="text-4xl font-black tracking-tight text-slate-900">Cinema Seat Manager</h1>
      <p class="text-slate-600">Interactive challenge complete: use the visual seat map below to reserve seats with clicks.</p>
    </section>

    <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 class="text-xl font-semibold text-slate-900">Interactive Seat Map</h2>
      <p class="mt-2 text-sm text-slate-600">Legend: <span class="font-bold text-emerald-700">L = available</span>, <span class="font-bold text-rose-700">X = occupied</span>.</p>
      <div class="mt-3 flex flex-wrap gap-2">
        <button id="find-adjacent-btn" type="button" class="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">Find Adjacent Seats</button>
        <button id="clear-highlights-btn" type="button" class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Clear Highlights</button>
      </div>
      <div id="interactive-seat-map" class="mt-4"></div>
      <div id="interactive-status" class="mt-4 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700"></div>
    </section>
  `;

  renderInteractiveSeatManager(interactiveRoom, interactiveMessage, highlightedSeats);

  app.addEventListener("click", (event) => {
    const rawTarget = event.target;

    if (!(rawTarget instanceof HTMLElement)) {
      return;
    }

    const clickedButton = rawTarget.closest("button");

    if (!(clickedButton instanceof HTMLButtonElement)) {
      return;
    }

    if (clickedButton.id === "find-adjacent-btn") {
      console.log("\nAction: Find Adjacent Seats");
      const pair = findAdjacentAvailableSeats(interactiveRoom);

      if (pair) {
        highlightedSeats = [pair[0], pair[1]];
        console.log(`First adjacent available seats: (${pair[0][0]}, ${pair[0][1]}) and (${pair[1][0]}, ${pair[1][1]}).`);
      } else {
        highlightedSeats = [];
        console.log("No adjacent available seats found.");
      }

      printSeatCounters(interactiveRoom);
      renderInteractiveSeatManager(interactiveRoom, interactiveMessage, highlightedSeats);
      return;
    }

    if (clickedButton.id === "clear-highlights-btn") {
      console.log("\nAction: Clear Highlights");
      highlightedSeats = [];
      console.log("Highlights cleared. Click Find Adjacent Seats to search again.");
      printSeatCounters(interactiveRoom);
      renderInteractiveSeatManager(interactiveRoom, interactiveMessage, highlightedSeats);
      return;
    }

    if (!clickedButton.classList.contains("seat-btn")) {
      return;
    }

    const rowValue = Number(clickedButton.dataset.row);
    const columnValue = Number(clickedButton.dataset.column);

    if (!Number.isFinite(rowValue) || !Number.isFinite(columnValue)) {
      return;
    }

    console.log(`\nAction: Reserve Seat (${rowValue}, ${columnValue})`);
    const [, message] = reserveSeat(interactiveRoom, rowValue, columnValue, true);
    interactiveMessage = message;
    highlightedSeats = [];
    printSeatCounters(interactiveRoom);
    renderInteractiveSeatManager(interactiveRoom, interactiveMessage, highlightedSeats);
  });
}
