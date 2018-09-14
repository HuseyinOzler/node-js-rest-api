const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../../app');
const expect = require('chai').expect
chai.use(chaiHttp);

let token, movieId;


describe('/api/movies tests', () => {
    
	before((done) => {
            chai.request(server)
            .post('/authenticate')
            .send({username: 'ozler', password: '12345'})
			.end((err, res) => {
                token = res.body.token
				done();
            });
	});

    describe('/get movies',()=>{
        it('tüm filimleri getirir', (done) => {
            chai.request(server)
                .get('/api/movies')
                .set('x-access-token',token)
                .end((err,res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        })
    });


    describe('/post movies',() => {
        it('filim kaydetme testi',(done)=>{
            const movie = {
                title:'bir katap düşün',
                director_id: '5b9a6b040fbbef080ccdd005',
                category:'dram',
                country:'türkiye',
                year:1950,
                imdb_score:8
            }
            
            chai.request(server)
            .post('/api/movies')
            .send(movie)
            .set('x-access-token',token)
            .end((err,res)=>{
                
                expect(movie).which.is.an('object').but.a.property('title').which.is.a('string')
                expect(movie).which.is.an('object').have.a.property('year').which.is.a('number')
                done();
            })
            
                   
                    
                
                
          
        });
    });




})

