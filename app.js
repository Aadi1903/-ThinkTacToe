let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let turn0 = true;

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

const resetGame = () => {
    turn0 = true;
    boxes.forEach(box => {
        box.innerText = "";
        box.disabled = false;
    });
    msgContainer.classList.add("hide");
};

boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
        if (turn0) { // Player move
            box.innerText = "O"; 
            box.disabled = true;
            turn0 = false;
            checkWinner();
            setTimeout(aiMove, 500);
        }
    });
});

const aiMove = () => {
    let bestMove = minimax([...boxes].map(box => box.innerText), "X").index;
    if (bestMove !== undefined) {
        boxes[bestMove].innerText = "X";
        boxes[bestMove].disabled = true;
        turn0 = true;
        checkWinner();
    }
};

const checkWinner = () => {
    for (let pattern of winPatterns) {
        let [a, b, c] = pattern;
        if (boxes[a].innerText && boxes[a].innerText === boxes[b].innerText && boxes[a].innerText === boxes[c].innerText) {
            showWinner(boxes[a].innerText);
            return;
        }
    }
    if ([...boxes].every(box => box.innerText !== "")) {
        msg.innerText = "It's a Draw!";
        msgContainer.classList.remove("hide");
    }
};

const showWinner = (winner) => {
    msg.innerText = `Winner: ${winner}`;
    msgContainer.classList.remove("hide");
    boxes.forEach(box => box.disabled = true);
};

// Minimax Algorithm
const minimax = (newBoard, player) => {
    let emptySpots = newBoard.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);
    
    if (checkWin(newBoard, "O")) return { score: -10 };
    if (checkWin(newBoard, "X")) return { score: 10 };
    if (emptySpots.length === 0) return { score: 0 };

    let moves = [];
    for (let spot of emptySpots) {
        let move = { index: spot };
        newBoard[spot] = player;
        move.score = minimax(newBoard, player === "X" ? "O" : "X").score;
        newBoard[spot] = "";
        moves.push(move);
    }

    return moves.reduce((bestMove, move) => 
        (player === "X" ? move.score > bestMove.score : move.score < bestMove.score) ? move : bestMove, 
        { score: player === "X" ? -Infinity : Infinity }
    );
};

const checkWin = (board, player) => winPatterns.some(pattern => pattern.every(index => board[index] === player));

resetBtn.addEventListener("click", resetGame);
newGameBtn.addEventListener("click", resetGame);
