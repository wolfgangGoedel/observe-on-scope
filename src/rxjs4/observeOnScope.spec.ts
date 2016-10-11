import { IScope } from 'angular';
import { expect } from 'chai';
import { spy } from 'sinon';
import { Observable } from 'rx';
import './observeOnScope';

describe('observeOnScope', () => {
  it('should be a function', () => {
    const obs = Observable.of(1);
    expect(obs.observeOnScope).to.be.a('function');
  });

  it('should not alter events', () => {
    const event = {};
    const obs = Observable.of(event);
    let actual: any;
    obs.observeOnScope({} as IScope).subscribe(e => actual = e);
    expect(actual === event).to.be.true;
  });

  it('should ...', () => {
    
  });
})