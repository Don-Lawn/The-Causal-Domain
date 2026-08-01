///////////////////////////////////////////////////////////
//  PVFSM.cpp
//  Implementation of the Class PVFSM
//  Created on:      24-Jul-2026 9:35:01 PM
//  Original author: don_l
///////////////////////////////////////////////////////////

#include "PVFSM.h"




PVFSM::PVFSM(){

}


PVFSM::~PVFSM(){

}


bool PVFSM::_hasHandler(const std::string& state, const std::string& event) const {

	return false;
}


void PVFSM::_invokeHandler(const std::string& state, const std::string& event, const std::unordered_map<std::string, double>& payload){

}


void PVFSM::_receive(const std::string& event, const std::unordered_map<std::string, double>& payload){

}


void PVFSM::on(const std::string& state, const std::string& event, std::function<void(const std::unordered_map<std::string, double>&)> handler){

}


void PVFSM::transition(const std::string& newState){

}