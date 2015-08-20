# ng-async-flow

> Async flow with more then $q.all 

## Installation
Reference `<script src="asyncFlow.min.js"></script>`

## Usage

```javascript
 var parallelFlow = new asyncFlow.Parallel();
 
     // cancel any on going requests 
     parallelFlow.cancel();
     
     parallelFlow
      .get(fakeApiRequest(1)).then(setupRequestHandler(0))
      .get(fakeApiRequest(2)).then(setupRequestHandler(1));
```