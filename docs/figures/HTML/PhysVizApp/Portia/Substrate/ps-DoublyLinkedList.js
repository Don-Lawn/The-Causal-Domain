/**
 * ============================================================
 * IdentityRef
 * ============================================================
 */
export class IdentityRef
{
    constructor(slot, guid = null)
    {
        this.slot = slot;
        this.guid = guid;
    }
}

/**
 * ============================================================
 * LinkedListNode
 * ============================================================
 */
export class LinkedListNode
{
    constructor(identityRef, payload = null)
    {
        this.identityRef = identityRef;

        this.previousSlot = 0;
        this.nextSlot = 0;

        this.payload = payload;
    }
}

/**
 * ============================================================
 * DoublyLinkedListIterator
 * ============================================================
 */
export class DoublyLinkedListIterator
{
    constructor(list)
    {
        this.list = list;

        this.parkingSlot = list.sentinelSlot;
        this.currentSlot = this.parkingSlot;
    }

    _notParked()
    {
        return this.currentSlot !== this.parkingSlot;
    }

    gotoNext()
    {
        const node =
            this.list.nodes[this.currentSlot];

        this.currentSlot =
            node.nextSlot;

        return this._notParked();
    }

    gotoPrevious()
    {
        const node =
            this.list.nodes[this.currentSlot];

        this.currentSlot =
            node.previousSlot;

        return this._notParked();
    }

    getCurrentItem()
    {
        if (!this._notParked())
        {
            return null;
        }

        return this.list.nodes[
            this.currentSlot
        ].payload;
    }

    getCurrentIdentityRef()
    {
        if (!this._notParked())
        {
            return null;
        }

        return this.list.nodes[
            this.currentSlot
        ].identityRef;
    }
    
    removeCurrent()
    {
        return this.list.removeCurrent(
            this);
    }
}

/**
 * ============================================================
 * DoublyLinkedList
 * ============================================================
 */
export class DoublyLinkedList
{
    constructor()
    {
        this.sentinelSlot = 0;

        this.nodes = [];

        this.sentinelNode =
            new LinkedListNode(
                null,
                null);

        this.nodes.push(
            this.sentinelNode);
    }

    _allocateNode(payload)
    {
        const slot =
            this.nodes.length;

        const identityRef =
            new IdentityRef(slot);

        const node =
            new LinkedListNode(
                identityRef,
                payload);

        this.nodes.push(node);

        return slot;
    }

    _insertBetween(
        predecessorSlot,
        successorSlot,
        newSlot)
    {
        const predecessor =
            this.nodes[
                predecessorSlot
            ];

        const successor =
            this.nodes[
                successorSlot
            ];

        const newNode =
            this.nodes[
                newSlot
            ];

        predecessor.nextSlot =
            newSlot;

        successor.previousSlot =
            newSlot;

        newNode.previousSlot =
            predecessorSlot;

        newNode.nextSlot =
            successorSlot;
    }

    insertAfter(
        payload,
        iterator = null)
    {
        const newSlot =
            this._allocateNode(
                payload);

        let predecessorSlot;

        if (iterator === null)
        {
            //
            // Append to list.
            //
            predecessorSlot =
                this.sentinelNode.previousSlot;
        }
        else
        {
            predecessorSlot =
                iterator.currentSlot;
        }

        const successorSlot =
            this.nodes[
                predecessorSlot
            ].nextSlot;

        this._insertBetween(
            predecessorSlot,
            successorSlot,
            newSlot);

        return this.nodes[
            newSlot
        ].identityRef;
    }

    getPayload(identityRef)
    {
        const node =
            this.nodes[
                identityRef.slot
            ];

        if (!node)
        {
            return null;
        }

        return node.payload;
    }

    getIterator()
    {
        return new DoublyLinkedListIterator(
            this);
    }

    _unlink(slot)
    {
        const node =
            this.nodes[slot];

        const predecessorSlot =
            node.previousSlot;

        const successorSlot =
            node.nextSlot;

        this.nodes[
            predecessorSlot
        ].nextSlot =
            successorSlot;

        this.nodes[
            successorSlot
        ].previousSlot =
            predecessorSlot;

        node.previousSlot = 0;
        node.nextSlot = 0;
    }
    removeCurrent(iterator)
    {
        if (!iterator._notParked())
        {
            return;
        }

        const removeSlot =
            iterator.currentSlot;

        iterator.gotoPrevious();

        this._unlink(removeSlot);
    }
}