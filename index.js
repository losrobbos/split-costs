
const users = [
  { _id: 1, name: "Tim", income: 1000 },
  { _id: 2, name: "Jonathan", income: 1000 },
  { _id: 3, name: "Norman", income: 2000 }
]

const expenses = [
  { title: "Toilet Paper", amount: 3, payedBy: 1, sharedBy: [ 1,2,3 ] },
  { title: "Swiss Chocolate", amount: 2, payedBy: 1, sharedBy: [ 1,3 ] },
  { title: "Peanut Butter", amount: 2, payedBy: 2, sharedBy: [ 1,2 ] }
]

// create balances for each user with one another
const balances = users.map(user => {

  // get all buddies of that user ...
  const buddies = users.filter( buddy => buddy._id != user._id )

  // create list of balances with each buddy (starting at 0)
  const buddyBalances = buddies.map(buddy => ({ 
    ...buddy, balance: 0 
  }))

  // create user balance with array of buddies
  return { ...user, balance: 0, balances: buddyBalances }
})


// split expense by expense among folks... 
expenses.forEach(expense => {
  const { amount, payedBy, sharedBy } = expense

  // total income on the plate
  const sharingUsers = users.filter(user => sharedBy.includes(user._id) )
  const totalIncome = sharingUsers.reduce((sum, user) => sum + user.income, 0)

  const payer = users.find( user => user._id == payedBy )

  const anteilPayer = amount * (payer.income / totalIncome)

  // get account of payer
  const payerBalance = balances.find( balance => balance._id == payedBy )

  // calculate outstanding remainder... and add it to total balance! 
  payerBalance.balance += amount - anteilPayer

  // loop through the shared array and assign cost to these mothafuckazzz
  sharedBy.forEach( buddyId => {

    // skip payer slice... 
    if(buddyId == payedBy) return

    const buddy = users.find(user => user._id == buddyId)

    // split amount by folks who have a share on that proportionally...
    const anteilBuddy = amount * (buddy.income / totalIncome)

    // grab account of debitor
    const debitorBalance = balances.find( balance => balance._id == buddyId )

    // assign the slice as credit for me against that dude
    const buddyItem = payerBalance.balances.find(buddy => buddy._id == buddyId)
    buddyItem.balance += anteilBuddy

    // assign the same slice as debt / minus to the balance of the dude
    const payerItem = debitorBalance.balances.find(buddy => buddy._id == payedBy)
    payerItem.balance -= anteilBuddy

    // decrease total balance of "debitor"
    debitorBalance.balance -= anteilBuddy
  })
  
})

// print that shit...
console.log( expenses )

balances.forEach(b => console.log(b))



