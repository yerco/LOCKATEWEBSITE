var expect = chai.expect;

describe('Object', function() {
    describe('Equality', function() {
        it('Target object deeply (but not strictly) equals `{a: 1}`', function() {
            expect({a: 1}).to.deep.equal({a: 1});
            expect({a: 1}).to.not.equal({a: 1});
        });
    });
});