///////////////////////////////////////////////////////////
//  ActiveEntity.h
//  Round‑trip safe version with private underscore methods
///////////////////////////////////////////////////////////

#if !defined(EA_1CE7CC1E_F720_40b8_9C65_F646DDE12EEF__INCLUDED_)
#define EA_1CE7CC1E_F720_40b8_9C65_F646DDE12EEF__INCLUDED_

#include <string>
#include "PVFSM.h"

class ActiveEntity
{
public:
    ActiveEntity();
    virtual ~ActiveEntity();

    ActiveEntity(const std::string& localBus,
                 const std::string& parentBus = "",
                 PVFSM* fsm = nullptr);

    void configureDefaultLifecycle();
    virtual void render(double dt);
    void toggleActive();
    virtual void update(double dt);

private:
    std::string _bus;
    std::string _parentBus;
    PVFSM* _fsm;

    // From EA model
    int _IgnoreMe;
    bool _isActive = true;

    // Private JS‑derived methods
    void _registerLifecycleEvents();
    void _registerParentSubscriptions();
    void _registerRenderEvents();
    void _registerTickEvents();
};

#endif
