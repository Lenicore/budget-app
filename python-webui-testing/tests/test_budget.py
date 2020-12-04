import pytest
from selenium.webdriver import Chrome
from selenium.webdriver.common.keys import Keys
from selenium import webdriver


@pytest.fixture
def browser():
  # driver = Chrome()
  driver = Chrome(executable_path=r'C:\Users\Lenic\Desktop\Dev 201\Section 1\budget-app\drivers\chromedriver.exe')
  driver.implicitly_wait(10)

  yield driver
  # driver.quit()

def test_budget_app_functionality(browser):
  URL = 'file:///C:/Users/Lenic/Desktop/Dev%20201/Section%201/budget-app/index.html'
  INCOME = '556'
  EXPENSE = '200'
  
  browser.get(URL)
  
  search_input = browser.find_element_by_id('incomeAmount')
  search_input.send_keys(INCOME + Keys.RETURN)
  incomeBtn = browser.find_elements_by_class_name("addIncome")[0].click()


  search_input = browser.find_element_by_id('expenseAmount')
  search_input.send_keys(EXPENSE + Keys.RETURN)
  expenseBtn = browser.find_elements_by_class_name("addExpense")[0].click()

  
  link_divs = browser.find_elements_by_css_selector('.list > div')
  assert len(link_divs) > 0
  
