import { Component } from "./types/plugin.interface"

export const externe = {
    setupEJSComponent
}

function setupEJSComponent(component: Component) {
    let 
        thisClass = component.componentName,
	    blockClass = thisClass
	if((typeof component.this !== 'undefined' && component.this) && (typeof component.this.block !== 'undefined' && component.this.block))
        blockClass = component.this.block
	

	if((typeof component.this !== 'undefined' && component.this) && (typeof component.this.parent !== 'undefined' && component.this.parent)) 
        thisClass = `${component.this.parent}__${thisClass} ${blockClass}`
    else if((typeof component.this !== 'undefined' && component.this) && (typeof component.this.class !== 'undefined' && component.this.class)) {
		if(typeof component.this.class === 'string') 
            thisClass = `${component.this.class} ${blockClass}`
        else if(typeof component.this.class === 'object') 
            thisClass = `${component.this.class.join(' ')} ${blockClass}`
	} 
    else thisClass = blockClass

	let thisID = ''
	if((typeof component.this !== 'undefined' && component.this) && (typeof component.this.id !== 'undefined' && component.this.id)) {
		if(typeof component.this.id === 'string') 
            thisID = `id='${component.this.id}'`
		else if(typeof component.this.id === 'object') 
            thisID = `id='${component.this.id.join(' ')}'`
	}

	let thisTag = 'div'
	if((typeof component.this !== 'undefined' && component.this) && (typeof component.this.tag !== 'undefined' && component.this.tag))
        thisTag = component.this.tag

	let thisStyles = undefined
	if((typeof component.this !== 'undefined' && component.this) && (typeof component.this.style !== 'undefined' && component.this.style)) {
		if(typeof component.this.style === 'string') 
            thisStyles = `style='${component.this.style}'`
        else if(typeof component.this.style === 'object') 
            thisStyles = `style='${component.this.style.join(' ')}'`
	}

	let thisDataAttributes = ''
	if((typeof component.this !== 'undefined' && component.this) && (typeof component.this.dataAttribute !== 'undefined' && component.this.dataAttribute)) {
		if(typeof component.this.dataAttribute === 'string')
		    thisDataAttributes += ' ' + component.this.dataAttribute
		else if(typeof component.this.dataAttribute === 'object')
		    thisDataAttributes += ' ' + component.this.dataAttribute.join(' ')
	}

    return {blockClass, thisClass, thisID, thisTag, thisStyles, thisDataAttributes}
}