///////////////////////////////////////////////////////////
//  PVFSM.h
//  Implementation of the Class PVFSM
//  Created on:      24-Jul-2026 9:35:01 PM
//  Original author: don_l
///////////////////////////////////////////////////////////

#if !defined(EA_F761CDAB_1F24_4b96_AFAF_B7755B3E4BED__INCLUDED_)
#define EA_F761CDAB_1F24_4b96_AFAF_B7755B3E4BED__INCLUDED_

class PVFSM
{

public:
	PVFSM();
	virtual ~PVFSM();
	void _receive(const std::string& event, const std::unordered_map<std::string, double>& payload);
	void on(const std::string& state, const std::string& event, std::function<void(const std::unordered_map<std::string, double>&)> handler);
	void transition(const std::string& newState);

private:
	/**
	 * Map: state → event → handler
	 */
	std::unordered_map<
	        std::string,
	        std::unordered_map<
	            std::string,
	            std::function<void(const std::unordered_map<std::string, double>&)>
	        >
	    > _handlers;
	/**
	 * Current FSM state
	 */
	std::string _state;

	bool _hasHandler(const std::string& state, const std::string& event) const;
	void _invokeHandler(const std::string& state, const std::string& event, const std::unordered_map<std::string, double>& payload);

};
#endif // !defined(EA_F761CDAB_1F24_4b96_AFAF_B7755B3E4BED__INCLUDED_)
