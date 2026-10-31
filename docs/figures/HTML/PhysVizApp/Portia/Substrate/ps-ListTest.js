import {DoublyLinkedList} from "./ps-DoublyLinkedList.js";


const list =
    new DoublyLinkedList();

list.insertAfter("Fred");
list.insertAfter("Mary");
list.insertAfter("Bob");

const iterator =
    list.getIterator();

while (iterator.gotoNext())
{
    console.log( iterator.getCurrentItem());
}