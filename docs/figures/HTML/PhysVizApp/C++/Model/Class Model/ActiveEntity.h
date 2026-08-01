///////////////////////////////////////////////////////////
//  ActiveEntity.h
//  Implementation of the Class ActiveEntity
//  Created on:      24-Jul-2026 9:10:56 PM
//  Original author: don_l
///////////////////////////////////////////////////////////

#if !defined(EA_1CE7CC1E_F720_40b8_9C65_F646DDE12EEF__INCLUDED_)
#define EA_1CE7CC1E_F720_40b8_9C65_F646DDE12EEF__INCLUDED_

class ActiveEntity
{

public:
	ActiveEntity();
	virtual ~ActiveEntity();

	ActiveEntity(const std::string& localBus, const std::string& parentBus = "", PVFSM* fsm = nullptr);
	void configureDefaultLifecycle();
	virtual void render(double dt);
	void toggleActive();
	virtual void update(double dt);

private:
	std::string bus;
	PVFSM* fsm;
	/**
	 * From EA model
	 */
	int IgnoreMe;
	/**
	 * From EA model
	 */
	bool isActive = true;
	std::string parentBus;

	void registerLifecycleEvents();
	void registerParentSubscriptions();
	void registerRenderEvents();
	void registerTickEvents();

};
#endif // !defined(EA_1CE7CC1E_F720_40b8_9C65_F646DDE12EEF__INCLUDED_)
