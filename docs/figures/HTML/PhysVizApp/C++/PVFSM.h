///////////////////////////////////////////////////////////
//  PVFSM.hpp
//  Round‑trip safe FSM class for EA
//  Created on: 24-Jul-2026
///////////////////////////////////////////////////////////

#pragma once
#include <string>
#include <functional>
#include <unordered_map>

class PVFSM
{
public:
    PVFSM();
    virtual ~PVFSM();

    // Transition to a new state
    void transition(const std::string& newState);

    // Register a handler for (state, event)
    void on(const std::string& state,
            const std::string& event,
            std::function<void(const std::unordered_map<std::string, double>&)> handler);

    // Internal event receiver (JS: fsm._receive)
    void _receive(const std::string& event,
                  const std::unordered_map<std::string, double>& payload);

private:
    // Current FSM state
    std::string _state;

    // Map: state → event → handler
    std::unordered_map<
        std::string,
        std::unordered_map<
            std::string,
            std::function<void(const std::unordered_map<std::string, double>&)>
        >
    > _handlers;

    // Helper to find handler for (state, event)
    bool _hasHandler(const std::string& state, const std::string& event) const;

    // Invoke handler if present
    void _invokeHandler(const std::string& state,
                        const std::string& event,
                        const std::unordered_map<std::string, double>& payload);
};
