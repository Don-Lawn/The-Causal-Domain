///////////////////////////////////////////////////////////
//  ActiveEntity.h
//  Implementation of the Class ActiveEntity
//  Created on:      24-Jul-2026 9:35:01 PM
//  Original author: don_l
///////////////////////////////////////////////////////////

#if !defined(EA_46048549_CE79_4162_B002_CF5CD18C3E37__INCLUDED_)
#define EA_46048549_CE79_4162_B002_CF5CD18C3E37__INCLUDED_

#include "PVFSM.h"

class ActiveEntity
{

public:
	ActiveEntity();
	ActiveEntity(const std::string& localBus, const std::string& parentBus = "", PVFSM* fsm = nullptr);
	virtual ~ActiveEntity();
	void configureDefaultLifecycle();
	virtual void render(double dt);
	void toggleActive();
	virtual void update(double dt);

private:
	std::string _bus;
	PVFSM* _fsm;
	/**
	 * From EA model
	 */
	int _IgnoreMe;
	bool _isActive = true;
	std::string _parentBus;

	void _registerLifecycleEvents();
	void _registerParentSubscriptions();
	void _registerRenderEvents();
	void _registerTickEvents();

};
#endif // !defined(EA_46048549_CE79_4162_B002_CF5CD18C3E37__INCLUDED_)
