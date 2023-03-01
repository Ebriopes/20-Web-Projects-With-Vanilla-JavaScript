import './style.css';
import movies from './data';

const totalSeatsSelected = document.getElementById('seats-selected');
const amountTotal = document.getElementById('amount-total');
const seatsContainer = document.getElementById('seats');
const selectMovie = document.getElementById('movie');
const seatRows = Array.from(seatsContainer.firstElementChild.children);
const userSeats = new Map();
let price = 0;

selectMovie.value = '';

function cleanSeats(rows) {
  rows.forEach((row) => {
    Array.from(row.children).forEach((column) => {
      column.classList.remove('occupied', 'selected');
    });
  });

  userSeats.clear();
  updateAmount();
}

function updateAmount() {
  if (selectMovie.value) {
    price = movies.find((movie) => movie.id === selectMovie.value).price;
  }

  totalSeatsSelected.innerText = userSeats.size;
  amountTotal.innerText = '$' + price * userSeats.size;
}

// Add the movies available
movies.forEach((movie) => {
  const option = document.createElement('option');

  option.value = movie.id;
  option.innerText = `${movie.title} - $${movie.price}`;

  selectMovie.append(option);
});

selectMovie.addEventListener('input', (e) => {
  cleanSeats(seatRows);

  const value = e.target.value;

  const currentMovie = movies.find((movie) => movie.id === value);

  currentMovie.seatsOccupied.forEach((seat) => {
    const [row, column] = seat;

    if (seatRows[row]) {
      // firstElementChild is the tag <tbody>
      const occupiedSeat = Array.from(seatRows[row].children).find(
        (seat) => +seat.dataset.column === column
      );

      occupiedSeat.classList.add('occupied');
    }
  });
});

seatsContainer.addEventListener('click', (e) => {
  const target = e.target;
  const column = target.dataset.column;
  const row = target.closest('tr').dataset.row;
  const isOccupied = target.className.includes('occupied');
  const isSelected = target.className.includes('selected');

  if (column && !isOccupied) {
    target.classList.toggle('selected');

    if (!isSelected) {
      userSeats.set(`${row}${column}`);
    } else {
      userSeats.delete(`${row}${column}`);
    }

    updateAmount();
  }
});
