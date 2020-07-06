//dummy endpoint for testing CircleCi
export default (req, res) => {
    res.statuscode = 200
    res.setHeader = ('content-type','application/json')
    res.end(JSON.stringify({result: 'sample end point'}))
}