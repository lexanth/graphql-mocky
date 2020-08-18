FROM alex/graphql-mocky

# My schema is already in there, but you might need to copy it too
COPY resources/.graphql-mockyrc.yml ./
