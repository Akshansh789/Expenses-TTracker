document.addEventListener('DOMContentLoaded', function () {
    dataLoader()
  })
  
  const form = document.querySelector('.add-form')
  const tBody = document.querySelector('tbody')
  const date = document.getElementById('date')
  const description = document.getElementById('description')
  const category = document.getElementById('category')
  const amount = document.getElementById('amount')
  const inputs = document.querySelectorAll('input')
  const errorMsg = document.querySelector('.error-message')
  
  form.addEventListener('submit', addExpense)
  tBody.addEventListener('click', deleteExpense)
  
  function addExpense (e) {
    if (date.value.toString() === '' || description.value === '' || category.value === '' || amount.value === '') {
      e.preventDefault()
      inputs.forEach(input => input.classList.add('input-warning'))
      errorMsg.textContent = 'Input fields must not be empty!'
  
      return false
    }
    e.preventDefault()
    inputs.forEach(input => input.classList.remove('input-warning'))
    errorMsg.style.display = 'none'
  
    const dataObj = {
      date: date.value,
      description: description.value,
      category: category.value,
      amount: amount.value,
      id: new Date().getMilliseconds()
    }
    createExpenseTable(dataObj)
    dataSaver(dataObj)
    form.reset()
  }
  
  function dataSaver (dataObj) {
    const dataSet = dataStorageHelper()
    dataSet.push(dataObj)
    localStorage.setItem('dataSet', JSON.stringify(dataSet))
  }
  
  function dataLoader () {
    const dataSet = dataStorageHelper()
    dataSet.forEach(data => {
      createExpenseTable(data)
    })
  }
  
  function deleteExpense (e) {
    let tableRow
    if (!e.target.matches('.delete-icon')) {
      return false
    } else {
      tableRow = e.target.closest('tr')
      const storedExpenses = dataStorageHelper()
      const id = e.target.parentElement.parentElement.id
      const filteredExpenses = storedExpenses.filter(expense => expense.id.toString() !== id)
  
      localStorage.setItem('dataSet', JSON.stringify(filteredExpenses))
      tableRow.remove()
    }
  }
  
  function createExpenseTable (data) {
    const expenseRow = document.createElement('tr')
    expenseRow.id = data.id
    const dateTd = document.createElement('td')
    dateTd.classList = 'date-row'
    dateTd.textContent = data.date
    const descriptionTd = document.createElement('td')
    descriptionTd.classList = 'description-row'
    descriptionTd.textContent = data.description
    const categoryTd = document.createElement('td')
    categoryTd.classList = 'category-row'
    categoryTd.textContent = data.category
    const amountTd = document.createElement('td')
    amountTd.classList = 'amount-row'
    amountTd.textContent = data.amount
    const idTd = document.createElement('td')
    idTd.classList = 'id-row'
    idTd.textContent = data.id
    const deleteTd = document.createElement('td')
    const deleteIcon = document.createElement('i')
    deleteIcon.classList = 'fas fa-minus-circle delete-icon'
    deleteTd.appendChild(deleteIcon)
    expenseRow.appendChild(dateTd)
    expenseRow.appendChild(descriptionTd)
    expenseRow.appendChild(categoryTd)
    expenseRow.appendChild(amountTd)
    expenseRow.appendChild(idTd)
    expenseRow.appendChild(deleteTd)
    tBody.appendChild(expenseRow)
  }
  
  function dataStorageHelper () {
    const dataSet = !JSON.parse(localStorage.getItem('dataSet')) ? [] : JSON.parse(localStorage.getItem('dataSet'))
  
    return dataSet
  }
  
  // INCOMPLETE, SORT FUNCTIONALITY COMING SOON //
  const tableHeaders = document.getElementsByClassName('fa-sort')
  let clicked = false
  for (const header of tableHeaders) {
    let newData
    header.addEventListener('click', function (e) {
      const dataSet = JSON.parse(localStorage.getItem('dataSet'))
      newData = dataSet.slice()
      if (!clicked) {
        newData = newData.sort((a, b) => {
          return a.description.toLowerCase() > b.description.toLowerCase() ? 1 : -1
        })
      }
      clicked = true
      localStorage.setItem('dataSet', JSON.stringify(newData))
    })
    header.addEventListener('click', function (e) {
      if (clicked) {
        newData = newData.slice().sort().reverse()
      }
      localStorage.setItem('dataSet', JSON.stringify(newData))
      clicked = false
    })
  }