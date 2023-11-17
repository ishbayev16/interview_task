"use client"; // This is a client component 👈🏽

import Image from 'next/image'
import { Fragment, useState, useEffect } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'


export default function Home() {
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(true)
  const [localLoading, setLocalLoading] = useState(false)
  const [currency, setCurrency] = useState(null);

  const [selected, setSelected] = useState(null)


  useEffect(() => {
    console.log('run')
      fetch('https://restcountries.com/v3.1/region/europe?fields=name,flags')
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
  }, [])


  useEffect(() => {
    if(selected){
      setLocalLoading(true);
      fetch('https://api.api-ninjas.com/v1/country?name='+selected.name.official, 
        {
          method: "GET",
          withCredentials: true,
          headers: {
            "X-Api-Key": "ZoDpSzuq/9bSfBDV6nOfOw==I2LhHetDaYEmNugf",
            "Content-Type": "application/json"
          }
        })
      .then((res) => res.json())
      .then((data) => {
        setCurrency(data)
        setLocalLoading(false)
      })
    }
  }, [selected])
 
  if (isLoading) return <p className='center'>Loading...</p>
  if (!data) return <p className='center'>No data could be fetched</p>

  return (
    <main className='center' >

    
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative mt-1 w-2/3">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            <span className="flex truncate">{selected ? <><img src={selected.flags.svg} alt={selected.flags.alt} style={{height: 22, width: 30}} className="mr-2"/>  {selected.name.common} </> : "Select a country"}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {data.map((country, Idx) => (
                <Listbox.Option
                  key={Idx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-4 pr-4 ${
                      active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                    }`
                  }
                  value={country}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`flex truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        <img src={country.flags.svg} alt={country.flags.alt} style={{height: 22, width: 30}} className="mr-2"/>
              
                        {country.name.common}
                      </span>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>  

      <div className='flex items-center ml-10 w-1/3'> {localLoading ? 'loading....' : selected ? currency && currency.length > 0 ? <>{currency[0]?.currency?.code} {currency[0]?.gdp}</>: 'GDP not found!' : ''} </div>                  

    </main>
  )
}
