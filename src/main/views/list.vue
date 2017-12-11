<table>
    <tr><th v-for="h in head" :key="h">{{h}}</th></tr>
    <tr v-for="(book,idx) in books" :key="idx">
        <td>{{book.num}}</td>
        <td><a :href="book.link" target="_blank">{{book.name}}</a></td>
        <td>{{book.author}}</td>
        <td>{{book.press}}</td>
        <td>{{book.isbn}}</td>
        <td>{{book.store_time}}</td>
        <td>{{book.borrower}}</td>
        <td>{{book.erp}}</td>
        <td>{{book.bor_time}}</td>
    </tr>
</table>

