
import countryList from 'json/arrayofCountry.json'
import airline from 'json/arrayofAriline.json'
import countryCode from 'json/listOfCountryWithCode.json'

class World {

    arrayOfCountry = countryList
    arrayOfAirLines = airline;
    arrayOfCountryCode = countryCode
    getCountryList = () => Object.keys(this.arrayOfCountry)
    getCitiesList = () => Object.values(this.arrayOfCountry).flat(1).slice(0, 30).filter(
        (thing, i, arr) => arr.findIndex(t => t === thing) === i
    );
    getCitiesListByName = (string) => Object.values(this.arrayOfCountry).flat(1).filter(v => v.toLocaleLowerCase().startsWith(string.toLocaleLowerCase())).slice(0, 30).filter(
        (thing, i, arr) => arr.findIndex(t => t === thing) === i
    );
    getCitiesByCountry = (country) => Object.entries(this.arrayOfCountry).filter(([key, value]) => key === country ? value : null)
    getListOfAirLine = () => this.arrayOfAirLines.map((a) => a.name).slice(0, 30).filter(
        (thing, i, arr) => arr.findIndex(t => t === thing) === i
    );
    getListOfAirLineByName = (string) => this.arrayOfAirLines.filter(v => v.name.toLocaleLowerCase().startsWith(string.toLocaleLowerCase())).slice(0, 30).map((a) => a.name).filter(
        (thing, i, arr) => arr.findIndex(t => t === thing) === i
    );
    getCountryLabelWithCode = (country) => this.arrayOfCountryCode.filter(code => code.label === country)

}

export default World