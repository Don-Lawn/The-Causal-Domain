class MultiAxisFSM
{
    constructor(initialAxes = {})
    {
        this.axes = {};
        this.handlers = [];

        for (const [name, state] of Object.entries(initialAxes))
        {
            this.axes[name] = state;
        }
    }

    addAxis(name, initialState)
    {
        this.axes[name] = initialState;
    }

    removeAxis(name)
    {
        delete this.axes[name];
    }

    getState(axis)
    {
        return this.axes[axis];
    }

    setState(axis, state)
    {
        this.axes[axis] = state;
    }

    getCompositeState()
    {
        return Object.values(this.axes).join(".");
    }

    getSnapshot()
    {
        return structuredClone(this.axes);
    }

    matches(criteria)
    {
        for (const [axis, expected] of Object.entries(criteria))
        {
            if (this.axes[axis] !== expected)
            {
                return false;
            }
        }

        return true;
    }

    on(criteria, eventName, handler)
    {
        this.handlers.push(
        {
            criteria,
            eventName,
            handler
        });
    }

    dispatch(eventName, payload)
    {
        for (const entry of this.handlers)
        {
            if (entry.eventName !== eventName)
            {
                continue;
            }

            if (!this.matches(entry.criteria))
            {
                continue;
            }

            entry.handler(payload, this);
        }
    }
}