export const action = `
<b><u>Action :</u></b><br>
<img width="400" height="200" src="../assets/images/action.png" alt="Image"> 
    `;

export const source_ip = `
<b><u>Source IP/Network :</u></b><br>
With the source and destination, you specify the source of the traffic and the destination of the traffic, respectively. 
You can assign IP addresses, (both IPv4 and IPv6 are supported) and IP ranges. These can be combined with operators:

<img width="400" height="200" src="../assets/images/ip1.png" alt="Image"> <br><br>

Rule usage examples: <br><br>
<img width="400" height="200" src="../assets/images/ip2.png" alt="Image"> <br><br>
`

export const destination_ip = `
<b><u>Destination IP/Network :</u></b><br>
With the source and destination, you specify the source of the traffic and the destination of the traffic, respectively. 
You can assign IP addresses, (both IPv4 and IPv6 are supported) and IP ranges. These can be combined with operators:
<img width="400" height="200" src="../assets/images/ip1.png" alt="Image"> <br><br>

Rule usage examples: <br><br>
<img width="400" height="200" src="../assets/images/ip2.png" alt="Image"> <br><br>
`
export const pcre = `
<b><u>pcre :</u></b><br>
The keyword pcre matches specific on regular expressions. <br>
More information about regular expressions can be found here http://en.wikipedia.org/wiki/Regular_expression.
<br><br>
Format of pcre: <br>
pcre:"/&lt;regex&gt;/opts"; <br>

Example of pcre. In this example there will be a match if the payload contains six numbers following: <br><br>
pcre:"/[0-9]{6}/";
<br>
There are a few qualities of pcre which can be modified:<br>
<ul>
<li>By default pcre is case-sensitive.</li>
<li>The . (dot) is a part of regex. It matches on every byte except for newline characters.</li>
<li>By default the payload will be inspected as one line.</li>
</ul>

<br><br>
These qualities can be modified with the following characters: <br>
i    pcre is case insensitive<br>
s    pcre does check newline characters<br>
m    can make one line (of the payload) count as two lines<br>

<br> 
These options are perl compatible modifiers. To use these modifiers, you should d  \

The checksums will be recalculated by Suricata and changed after the replace keyword is being used.
`

export const source_port = `
<b><u>Source Port:</u></b><br>
Traffic comes in and goes out through ports. Different protocols have different port numbers. 
For example, the default port for HTTP is 80 while 443 is typically the port for HTTPS. 
Note, however, that the port does not dictate which protocol is used in the communication. 
Rather, it determines which application is receiving the data. <br><br>

The ports mentioned above are typically the destination ports. Source ports, i.e. the application that sent the packet,
typically get assigned a random port by the operating system.
When writing a rule for your own HTTP service, you would typically write any -> 80, 
since that would mean any packet from any source port to your HTTP application (running on port 80) is matched.<br><br>

In setting ports you can make use of special operators as well. Operators such as: <br><br>
<img width="400" height="200" src="../assets/images/port1.png" alt="Image"> <br><br>
Rule usage examples: <br><br>
<img width="400" height="200" src="../assets/images/port2.png" alt="Image"> <br><br>
`

export const destination_port = `
<b><u>Destination Port:</u></b><br>
Traffic comes in and goes out through ports. Different protocols have different port numbers. 
For example, the default port for HTTP is 80 while 443 is typically the port for HTTPS. 
Note, however, that the port does not dictate which protocol is used in the communication. 
Rather, it determines which application is receiving the data. <br><br>

The ports mentioned above are typically the destination ports. Source ports, i.e. the application that sent the packet,
typically get assigned a random port by the operating system.
When writing a rule for your own HTTP service, you would typically write any -> 80, 
since that would mean any packet from any source port to your HTTP application (running on port 80) is matched.<br><br>

In setting ports you can make use of special operators as well. Operators such as: <br><br>
<img width="400" height="200" src="../assets/images/port1.png" alt="Image"> <br><br>
Rule usage examples: <br><br>
<img width="400" height="200" src="../assets/images/port2.png" alt="Image"> <br><br>
`

export const flow_direction = `
<b><u>Flow Direction :</u></b><br>
Direction can be single or both. When it is single it is always from source to destination. 
When we want to match traffic from both source to destination and vice-versa, both will be used
`

export const msg=`
<b><u>Alert Message :</u></b><br>
The keyword msg gives contextual information about the signature and the possible alert.
`

export const sid = `
<b><u>Signature ID :</u></b><br>
The keyword sid gives every signature its own id. This id is stated with a number greater than zero.
`

export const rev = `
<b><u>Revision Number :</u></b><br>
The Signature keyword is commonly accompanied by the Revision keyword.
If a signature is modified, the number of rev will be incremented by the signature writers. 
`
export const flow = `
The flow keyword can be used to match on direction of the flow, so to/from client or to/from server. 
It can also match if the flow is established or not. 
The flow keyword can also be used to say the signature has to match on stream only (only_stream) or on packet only (no_stream).
<br><br>
So with the flow keyword you can match on:
<br><br>
to_client:<br>
Match on packets from server to client.
<br><br>

to_server:<br>
Match on packets from client to server.
<br><br>

from_client:<br>
Match on packets from client to server (same as to_server).
<br><br>

from_server:<br>
Match on packets from server to client (same as to_client).
<br><br>

established:<br>
Match on established connections.
<br><br>

not_established:<br>
Match on packets that are not part of an established connection.
<br><br>

stateless:<br>
Match on packets that are and are not part of an established connection.
<br><br>

only_stream:<br>
Match on packets that have been reassembled by the stream engine.
<br><br>

no_stream:<br>
Match on packets that have not been reassembled by the stream engine. Will not match packets that have been reassembled.
<br><br>

only_frag:<br>
Match packets that have been reassembled from fragments.
<br><br>

no_frag:<br>
Match packets that have not been reassembled from fragments.
<br><br>

Multiple flow options can be combined.<br><br>

The determination of established depends on the protocol:<br>
For TCP a connection will be established after a three way handshake.<br>
For other protocols (for example UDP), the connection will be considered established after seeing traffic from both sides of the connection.
`

export const offset=`
<b><u>offset:</u></b><br>
The offset keyword designates from which byte in the payload will be checked to find a match. 
For instance offset:3; checks the fourth byte and further. So if payload is abcdef then offset:3 match the content from character d onwords. Value must be numeric`

export const nocase=`
<b><u>nocase:</u></b><br>
If you do not want to make a distinction between uppercase and lowercase characters, you can use nocase.
`

export const depth=`
<b><u>depth:</u></b><br>
The depth content modifier comes with a mandatory numeric value, like: <br><br>
depth:3 <br><br>
The number after depth designates how many bytes from the beginning of the payload will be checked. <br>
So if payload is abcdef then depth:3 will match abc in the content string`

export const startswith=`
<b><u>startswith:</u></b><br>
The startswith keyword is similar to depth. It takes no arguments and must follow a content keyword. It modifies the content to match exactly at the start of a buffer.
<br><br>
Example: 
<br>
content:"GET|20|"; startswith; <br><br>
startswith is a short hand notation for: <br><br>
content:"GET|20|"; depth:4; offset:0;<br><br>
startswith cannot be mixed with depth, offset, within or distance for the same pattern.
`
export const endswith=`
<b><u>endswith:</u></b><br>
It takes no arguments and must follow a content keyword. It modifies the content to match exactly at the end of a buffer.<br><br>
Example:<br><br>
content:".php"; endswith;
<br><br>
endswith cannot be mixed with offset, within or distance for the same pattern.
`

export const distance=`
<b><u>distance:</u></b><br>
The keyword distance is a relative content modifier. This means it indicates a relation between this content keyword and the content preceding it. 
Distance has its influence after the preceding match. The keyword distance comes with a mandatory numeric value. The value you give distance, 
determines the byte in the payload from which will be checked for a match relative to the previous match.<br>
So, distance:5; means the pattern can be anywhere after the previous match + 5 bytes. <br>
The absolute value for distance must be less than or equal to 1MB (1048576). <br><br>

Examples of distance: <br><br>

<img width="300" height="200" src="../assets/images/distance.png" alt="Image"> <br><br>

<b><font color="red">Note: To create rule with distance keyword, add the first content without content modifier and then add the second content with distance modifier</font></b>
`

export const within=`
<b><u>within:</u></b><br>
The keyword within is relative to the preceding match. The keyword within comes with a mandatory numeric value. 
Using within makes sure there will only be a match if the content matches with the payload within the set amount of bytes. <b>Within can not be 0 (zero)</b>
<br>
The absolute value for within must be less than or equal to 1MB (1048576).
<br>
Example:<br><br>
<img width="350" height="150" src="../assets/images/within1.png" alt="Image"> <br><br>
Example of matching with within: <br><br>
<img width="350" height="150" src="../assets/images/within2.png" alt="Image"> <br><br>
The distance and within can be very well combined in a signature. If you want Suricata to check a specific part of the payload for a match, use within.<br><br>
<img width="350" height="350" src="../assets/images/within3.png" alt="Image"> <br><br>

<b><font color="red">Note: To create rule with distance keyword, add the first content without content modifier and then add the second content with within modifier</font></b>
`

export const isdataat=`
<b><u>isdataat:</u></b><br>
The purpose of the isdataat keyword is to look if there is still data at a specific part of the payload. 
The keyword starts with a number (the position) and then optional followed by 'relative'.
You use the option 'relative' to know if there is still data at a specific part of the payload relative to the last match.
<br>
Example:<br><br>

isdataat:512;<br>
isdataat:50, relative;<br>

<img width="300" height="200" src="../assets/images/isdataat.png" alt="Image"> <br><br>
`

export const bsize=`
<b><u>bsize:</u></b><br>
With the bsize keyword, you can match on the length of the buffer. 
<br><br>An optional operator can be specified; if no operator is present, the operator will default to '='. 
When a relational operator is used, e.g., '<', '>' or '<>' (range), the bsize value will be compared using the relational operator. Ranges are inclusive.
<br><br>If one or more content keywords precedes bsize, each occurrence of content will be inspected and an error will be raised if the content length and the bsize value prevent a match.
<br><br>
Format:
<br><br>
bsize:<number>;<br>
bsize:=<number>;<br>
bsize:<<number>;<br>
bsize:><number>;<br>
bsize:<lo-number><><hi-number>;<br>
`

export const dsize=`
<b><u>dsize:</u></b><br>
With the dsize keyword, you can match on the size of the packet payload/data. 
You can use the keyword for example to look for abnormal sizes of payloads which are equal to some n i.e. 'dsize:n'
This may be convenient in detecting buffer overflows.<br>

dsize cannot be used when using app/streamlayer protocol keywords (i.e. http.uri)<br><br>
Format:<br><br>
dsize:[<>]number; || dsize:min<>max;<br>
`

export const byte_test=`
<b><u>byte_test:</u></b><br>
The byte_test keyword extracts <b>&lt;num of bytes&gt;</b> and performs an operation selected with <b>&lt;operator&gt;</b> against the value in <b>&lt;test value&gt;</b> at a particular 
<b>&lt;offset&gt;</b>. 
The <b>&lt;bitmask value&gt;</b> is applied to the extracted bytes 
(before the operator is applied), and the final result will be right shifted one bit for each trailing 0 in the <b>&lt;bitmask value&gt;</b>.
<br><br>Format:<br><br>

byte_test:<b>&lt;num of bytes&gt;</b>, [!]<b>&lt;operator&gt;</b>, <b>&lt;test value&gt;</b>, <b>&lt;offset&gt;</b> [,<b>&lt;relative&gt;</b>] \  
[,<b>&lt;endian&gt;</b>][, string, <b>&lt;num type&gt;</b>][, dce][, bitmask <b>&lt;bitmask value&gt;</b>];
<br>
<img width="500" height="500" src="../assets/images/byte_test2.png" alt="Image"> <br><br>
`
export const byte_math=`
<b><u>byte_math:</u></b><br>
The byte_math keyword adds the capability to perform mathematical operations on extracted values with an existing variable or a specified value.

When relative is included, there must be a previous content or pcre match.

Note: if oper is / and the divisor is 0, there will never be a match on the byte_math keyword.

The result can be stored in a result variable and referenced by other rule options later in the rule.<br><br>

<img width="400" height="200" src="../assets/images/bytemath1.png" alt="Image"> <br><br>

Format:<br><br>

byte_math:bytes &lt;num of bytes&gt; | &lt;variable-name&gt; , offset &lt;offset&gt;, oper &lt;operator&gt;, rvalue &lt;rvalue&gt;, \
      result &lt;result_var&gt; [, relative] [, endian &lt;endian&lt;] [, string &lt;number-type&gt;] \
      [, dce] [, bitmask &lt;value&gt;];

<br><br>
<img width="400" height="400" src="../assets/images/bytemath2.png" alt="Image"> <br><br>
`

export const byte_jump=` 
The byte_jump keyword allows for the ability to select a &lt;num of bytes&gt; from an &lt;offset&gt; 
and moves the detection pointer to that position. Content matches will then be based off the new position.

<br><br>Format:<br><br>

byte_jump:bytes &lt;num of bytes&gt; | &lt;variable-name&gt;,  &lt;offset&gt; [, relative], [, multiplier &lt;mult_value&glt;]
[, endian &lt;endian&lt;] [, string &lt;num_type&gt;][, align][, from_beginning][, from_end] 
[, post_offset &lt;value&gt;][, dce][, bitmask &lt;value&gt;];


<br><br>
<img width="400" height="400" src="../assets/images/byte_jump.png" alt="Image"> <br><br>
`

export const strip_whitespace=`
It remmoves leading and trailing white space from the payload
`


export const compress_whitespace=`
Compresses all consecutive whitespace into a single space.`

export const to_md5=`
Takes the buffer, calculates the MD5 hash and passes the raw hash value on.
`

export const to_sha1=`
Takes the buffer, calculates the SHA-1 hash and passes the raw hash value on.
`

export const to_sha256=`
Takes the buffer, calculates the SHA-256 hash and passes the raw hash value on.
`

export const fast_pattern=`
Only one content of a signature will be used in the Multi Pattern Matcher (MPM). 
If there are multiple contents, then Suricata uses the 'strongest' content. 
This means a combination of length, how varied a content is, and what buffer it is looking in. 
Generally, the longer and more varied the better. 
<br><br>
Sometimes a signature writer concludes he wants Suricata to use another content than it does by default.
<br><br>
For instance:
<br><br>

User-agent: Mozilla/5.0 Badness;<br>
content:"User-Agent|3A|";<br>
content:"Badness"; distance:0;<br><br>

In this example you see the first content is longer and more varied than the second one, 
so you know Suricata will use this content for the MPM. 
Because 'User-Agent:' will be a match very often, and 'Badness' appears less often in network traffic, 
you can make Suricata use the second content by using 'fast_pattern'.

<br><br>
content:"User-Agent|3A|";<br>
content:"Badness"; distance:0; fast_pattern;
<br>
The keyword fast_pattern modifies the content previous to it.
<br><br>
<img width="400" height="100" src="../assets/images/fastpattern.png" alt="Image"> <br><br>

`

export const byte_extract=`
The byte_extract keyword extracts &lt;num of bytes&gt; at a particular &lt;offset&gt; and stores it in &lt;variable-name&gt;. 
The value in &lt;variable-name&gt; can be used in any modifier that takes a number as an option and in the case of byte_test it can be used as a value.

<br><br>Format:<br><br>
byte_extract:&lt;num of bytes&gt;,  &lt;offset&gt;,  &lt;variable-name&gt;., [,relative] [, multiplier &lt;mult_value&gt;]
      [,&lt;endian&lt;] [, dce] [, string [, &lt;num_type&gt;] [, align &lt;align-value&gt;];

<br><br>
<img width="400" height="300" src="../assets/images/byte_extract.png" alt="Image"> <br><br>
      
`

export const fast_pattern_only=`
Sometimes a signature contains only one content. In that case it is not necessary Suricata will 
check it any further after a match has been found in MPM. If there is only one content, the whole signature matches. 
Suricata notices this automatically. In some signatures this is still indicated with 'fast_pattern:only;'. 
Although Suricata does not need fast_pattern:only, it does support it.
`
export const flowbits=`
Flowbits consists of two parts. The first part describes the action it is going to perform, the second part is the name of the flowbit.
There are multiple packets that belong to one flow. Suricata keeps those flows in memory.
Flowbits can make sure an alert will be generated when for example two different packets match. An alert will only be generated when both packets match. 
So, when the second packet matches, Suricata has to know if the first packet was a match too. 
Flowbits marks the flow if a packet matches so Suricata 'knows' it should generate an alert when the second packet matches as well.
<br><br>
Flowbits have different actions. These are:<br><br>

flowbits: set, name<br>
Will set the condition/'name', if present, in the flow.<br><br>
flowbits: isset, name<br>
Can be used in the rule to make sure it generates an alert when the rule matches and the condition is set in the flow.<br><br>
flowbits: toggle, name<br>
Reverses the present setting. So for example if a condition is set, it will be unset and vice-versa.<br><br>
flowbits: unset, name<br>
Can be used to unset the condition in the flow.<br><br>
flowbits: isnotset, name<br>
Can be used in the rule to make sure it generates an alert when it matches and the condition is not set in the flow.<br><br>
flowbits: noalert<br>
No alert will be generated by this rule.<br><br>
`

export const flowint=`
Flowint allows storage and mathematical operations using variables. It operates much like flowbits but with the addition of
 mathematical capabilities and the fact that an integer can be stored and manipulated, not just a flag set. 
 We can use this for a number of very useful things, such as counting occurrences, adding or subtracting occurrences, 
 or doing thresholding within a stream in relation to multiple factors. 
 This will be expanded to a global context very soon, so users can perform these operations between streams.
 <br> <br>
 The syntax is as follows: <br> <br>
 flowint: name, modifier[, value];
 <br> <br>

 Define a var (not required), or check that one is set or not set.

 flowint: name, &lt; +,-,=,&gt;,&lt;,&gt;=,&lt;=,==, != &gt;, value; <br>
flowint: name, (isset|isnotset);

<br> <br>
Compare or alter a var. Add, subtract, compare greater than or less than, 
greater than or equal to, and less than or equal to are available. The item to compare with can be an integer or another variable.
<br> <br>
For example, if you want to count how many times a username is seen in a particular stream and alert if it is over 5.
<br> <br>

alert tcp any any -&gt; any any (msg:"Counting Usernames"; content:"jonkman"; \
      flowint: usernamecount, +, 1; noalert;)
<br> <br>  
This will count each occurrence and increment the var usernamecount and not generate an alert for each.
<br> <br>
Now say we want to generate an alert if there are more than five hits in the stream.
<br> <br>
alert tcp any any -&gt; any any (msg:"More than Five Usernames!"; content:"jonkman"; \
      flowint: usernamecount, +, 1; flowint:usernamecount, &gt;, 5;)

`

export const stream_size=`
The stream size option matches on traffic according to the registered amount of bytes by the sequence numbers. There are several modifiers to this keyword:

&gt;      greater than <br>
&lt;      less than <br>
=      equal <br>
!=     not equal <br>
>=    greater than or equal <br>
<=    less than or equal <br>
<br> <br> Format <br> <br>
stream_size:&lt; server|client|both|either&gt; , &lt; modifier&gt; , &lt; number&gt; ;
<br> <br> 
Example of the stream-size keyword in a rule:
<br> <br> 

alert tcp any any -&gt; any any (stream_size:both, &gt;, 5000; sid:1;)

`

export const http_uri= `
With the http.uri and the http.uri.raw sticky buffers, 
it is possible to match specifically and only on the request URI buffer. 
The keyword can be used in combination with content modifiers 

The uri has two appearances in Suricata: the uri.raw and the normalized uri. 
The space for example can be indicated with the heximal notation %20. To convert this notation in a space, means normalizing it. 
It is possible though to match specific on the characters %20 in a uri. 
This means matching on the uri.raw. The uri.raw and the normalized uri are separate buffers. 
So, the uri.raw inspects the uri.raw buffer and can not inspect the normalized buffer.
<br><br>
Example of the URI in a HTTP request:
<br>
GET /index.html HTTP/1.0\r\n
<br><br>
Example of the purpose of http.uri:
<br><br>

<img width="400" height="400" src="../assets/images/http_uri.png" alt="Image"> <br><br>

`
export const http_uri_raw= http_uri

export const http_method=`
With the http_method sticky buffer, it is possible to match specifically and only on the HTTP method buffer. 
The keyword can be used in combination with content modifiers such as: depth, distance, offset, nocase and within.
<br><br>
Examples of methods are: GET, POST, PUT, HEAD, DELETE, TRACE, OPTIONS, CONNECT and PATCH.
<br><br>
Example of a method in a HTTP request:
<br><br>

<img width="300" height="300" src="../assets/images/http_method.png" alt="Image"> <br><br>
`
export const http_request_line=`
The http.request_line forces the whole HTTP request line to be inspected.<br><br>

Example:<br><br>

alert http any any -&gt; any any (http.request_line; content:"GET / HTTP/1.0"; sid:1;)

`

export const http_header=`
With the http.header content modifier, it is possible to match specifically and only on the HTTP header buffer. This contains all of the extracted headers in a single buffer.
The modifier can be used in combination with other content modifiers, like depth, distance, offset, nocase and within
<br>Note: the header buffer is normalized. Any trailing whitespace and tab characters are removed.<br>
Example of a header in a HTTP request: <br><br>

<b>
GET / HTTP/1.1 <br>
Host: www.google.com <br>
Connection: keep-alive <br>
Accept: application/xml <br>
</b>
<br>
Example of the purpose of http.header: <br><br>
<img width="400" height="200" src="../assets/images/header2.png" alt="Image"> <br><br>
<img width="400" height="200" src="../assets/images/header3.png" alt="Image"> <br><br>
`