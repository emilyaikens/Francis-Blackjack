class Deck{
    constructor(){
        this.deck = [];
        const suits = ['spades', 'clubs', 'hearts', 'diamonds'];
        const cardNums = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
        suits.forEach((suit)=>{
            cardNums.forEach((cardNum)=>{
                let card = {suit: suit, cardNum: cardNum};
                this.deck.push(card);
            });
        });
        };
    shuffle(){ //TIL about the fisher-yates algorithm
        for(let i = this.deck.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * (i + 1));
            const temp = this.deck[i];
            this.deck[i] = this.deck[j];
            this.deck[j] = temp;
        }}
};
const scoreCounter = {'ace': [11], 
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    'jack': 10,
    'queen': 10,
    'king' :10}
let cards = new Deck;
let pScore = 0;
let dScore = 0;
let dHiddenScore = 0;
let pHand = []
let dHand = []
let discardPile = []
let pAcesUsed = 0;
let dAcesUsed = 0;

init();

// jQuery
$(function(){ 
    // $('#deal').prop('disabled', true);
    $('#reset-game').click(init);
    $('#hit').click(() => { 
        pHand.push(cards.deck.pop());
        console.log('pHand is', pHand);
        pCount();
    });
    $('#stay').click(dCount);
    $('#test').click(clearHands);
    $('#testtwo').click(deal);
    $('#deal').click(()=> { 
        clearHands();
        deal();
        $('#hit').prop('disabled', false);
        $('#stay').prop('disabled', false);
        // console.log(`You got [${pHand[0].cardNum} of ${pHand[0].suit}] and [${pHand[1].cardNum} of ${pHand[1].suit}]`);
        // console.log(`Dealer's cards are [${dHand[0].cardNum} of ${dHand[0].suit}] and [${dHand[1].cardNum} of ${dHand[1].suit}]`);
    });
});

// functions below
function init(){
    pScore = 0;
    dScore = 0;
    pHand = []
    dHand = []
    cards = new Deck;
    cards.shuffle();
    console.log('Game Initialized...');
    console.log('deck count:', cards.deck);
    deal();
    console.log(`You got [${pHand[0].cardNum} of ${pHand[0].suit}] and [${pHand[1].cardNum} of ${pHand[1].suit}]`);
    console.log(`Dealer's cards are [${dHand[0].cardNum} of ${dHand[0].suit}] and [${dHand[1].cardNum} of ${dHand[1].suit}]`);
    // console.log(`Dealer's visible card is [${dHand[1].cardNum} of ${dHand[1].suit}]`);
    console.log('pHand is', pHand);
    console.log('dealer\'s hand is', dHand);
    pCount();
    dHiddenCount();
}

function pCount() {
    pAcesUsed = 0;
    let aceCheck = pHand.some((ace) => {
        return ace.cardNum === 'ace';
    });
    pScore = 0;
    for(let i = 0; i < pHand.length; i++){
        pScore = pScore + parseInt(scoreCounter[pHand[i].cardNum]);
    };
    if(pScore > 21 && aceCheck === true){
        pAcesUsed++
        pScore = pScore - (10 * pAcesUsed);
    };
    if(pScore === 21){
        $('h4').html('You got 21!');
        // $('#hit').prop('disabled', true);
    }  else if (pScore > 21){
        // $('#hit').prop('disabled', true);
        // $('#stay').prop('disabled', true);
        $('h4').html('BUST');
        $('#deal').prop('disabled', false);
    }
    $('#player-hand-count').html(pScore);
}

function dHiddenCount() {
    dHiddenScore = 0;
    dScore = 0;
    for(let i = 1; i < dHand.length; i++){
        dHiddenScore = dHiddenScore + parseInt(scoreCounter[dHand[i].cardNum]);
    };
    for(let i = 0; i < dHand.length; i++){
        dScore = dScore + parseInt(scoreCounter[dHand[i].cardNum]);
    }
    $('#dealer-hand-count').html(dHiddenScore);
}

function dCount() {
    console.log('dCount start')
    dAcesUsed = 0;
    while (dScore < 17) {
        console.log('dcount while loop triggered')
        dScore = 0;
        dHand.push(cards.deck.pop());
        for(let i = 0; i < dHand.length; i++){
            dScore = dScore + parseInt(scoreCounter[dHand[i].cardNum]);
            console.log(dScore, 'in dCount while loop and i is', i);
        };
        }
    let aceCheck = dHand.some((ace) => {
        return ace.cardNum === 'ace';
    });
    if(dScore > 21 && aceCheck === true){
        dAcesUsed++
        dScore = dScore - (10 * dAcesUsed);
    }
    if(dScore === 21 && dHand.length === 2 && pScore === 21 && pHand.length === 2){
        $('h4').html('both blackjacks. PUSH.');
    } else if(dScore === 21 && dHand.length === 2){
        $('#deal').prop('disabled', false); // dealer got blackjack
        $('h4').html('the dealer got blackjack');
    } else if(dScore === 21 && pScore === 21) {
        $('h4').html('PUSH');
    } else if (pScore === 21 && dScore === 21 && pHand.length === 2 && dHand.length !== 2) {
        $('h4').html('you got blackjack, dealer did not. You win!');
    } else if (dScore > 21){
        $('h4').html('dealer BUST');
        console.log('dealers hand is ', dHand)  
    } else if (21-dScore === 21-pScore){
        $('h4').html('PUSH');
        $('#deal').prop('disabled', false);
    } else if(21-dScore < 21-pScore){
        $('h4').html('the dealer has won.');
        $('#deal').prop('disabled', false);
    } else if(21-dScore > 21-pScore){
        $('h4').html('you have won.');
        $('#deal').prop('disabled', false);
    }
    $('#dealer-hand-count').html(dScore);
    console.log('dCount End. dHand is', dHand)
}

function clearHands() {
    console.log('clearHands run. current hand is', pHand, 'dHand is', dHand);
    console.log('pHand.length is', pHand.length, 'and dHand.length is', dHand.length);
    let pHandLength = pHand.length
    for(let i = 0; i < pHandLength; i++){
        let topPCard = pHand.pop(i);
        console.log(topPCard, 'sent to discard pile from pHand');
        discardPile.push(topPCard);
    }
    let dHandLength = dHand.length
    for(let j = 0; j < dHandLength; j++){
        let topDCard = dHand.pop(j);
        console.log(topDCard, 'sent to discard pile from dhand');
        discardPile.push(topDCard);
    }
    if (discardPile.length > cards.deck.length * .33){
        console.log('discard pile got large. creating new deck and shuffling.')
        cards = new Deck
        cards.shuffle();
        discardPile = []
    }
    console.log('clearHands end. pHand is', pHand, 'dHand is', dHand);
    console.log('discard pile is', discardPile);
};

function deal () {
    pHand.push(cards.deck.pop());
    dHand.push(cards.deck.pop());
    pHand.push(cards.deck.pop());
    dHand.push(cards.deck.pop());
    console.log(`You got [${pHand[0].cardNum} of ${pHand[0].suit}] and [${pHand[1].cardNum} of ${pHand[1].suit}]`);
    console.log(`Dealer's cards are [${dHand[0].cardNum} of ${dHand[0].suit}] and [${dHand[1].cardNum} of ${dHand[1].suit}]`);
    console.log(pHand, 'is pHand');
    console.log(dHand, 'is dHand');
    pCount();
    dHiddenCount();
};