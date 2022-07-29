import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({baseUrl:"http://localhost:3001"}),
    tagTypes: ["Heroes"],
    endpoints: builder => ({
        getHeroes: builder.query({
            query: () => '/heroes',
            providesTags: ["Heroes"]
        }),
        createHero: builder.mutation({
            query: hero => ({ 
                url: "/heroes",
                method: "POST",
                body: hero
            }),
            invalidatesTags: ["Heroes"]
        }),
        deleteHero: builder.mutation({
            query: id => ({
                url: `/heroes/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Heroes"]
        })
    })
})

export const {useGetHeroesQuery, useCreateHeroMutation, useDeleteHeroMutation} = apiSlice;



const arr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];

const off = 10;
let newArr = [...arr].slice(0, off+2);
console.log(newArr);


const emp = [];
console.log([]==true);


if(emp!=false){
    console.log('full')
} else { console.log('empty')}